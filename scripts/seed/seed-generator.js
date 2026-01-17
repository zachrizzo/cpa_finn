#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const SchemaParser = require('./schema-parser');
const FieldGenerators = require('./field-generators');

const SCHEMA_PATH = path.join(__dirname, '../../dataconnect/schema/schema.gql');
const PROFILES_PATH = path.join(__dirname, 'profiles.json');
const OUTPUT_DIR = path.join(__dirname, '../../dataconnect/example');
const STATIC_DATA_DIR = path.join(__dirname, 'data');

/**
 * Main seed generator - creates GraphQL seed mutations from schema
 */
class SeedGenerator {
  constructor(profileName = 'basic', options = {}) {
    this.profileName = profileName;
    this.parser = new SchemaParser(SCHEMA_PATH);
    this.generators = new FieldGenerators();
    this.profiles = JSON.parse(fs.readFileSync(PROFILES_PATH, 'utf8'));
    this.profile = this.profiles[profileName];
    this.userMapping = options.userMapping || null;

    if (!this.profile) {
      throw new Error(`Unknown profile: ${profileName}. Available: ${Object.keys(this.profiles).join(', ')}`);
    }

    // Pre-populate created IDs with mapped users
    if (this.userMapping) {
      const userIds = Object.values(this.userMapping).map(u => u.uid);
      for (const uid of userIds) {
        this.generators.trackCreatedEntity('User', uid);
      }
    }
  }

  async generate() {
    console.log(`\n🌱 Generating seed data for profile: ${this.profileName}`);
    console.log(`   ${this.profile.description}\n`);

    // Parse schema
    this.parser.parse();
    const entities = this.parser.getDependencyOrder();

    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Generate seed mutations
    const allMutations = [];

    for (const entity of entities) {
      const entityConfig = this.profile.entities[entity.name];
      if (!entityConfig) {
        console.log(`   ⏭️  Skipping ${entity.name} (not in profile)`);
        continue;
      }

      console.log(`   ✨ Generating ${entityConfig.count} ${entity.name} records...`);

      const mutation = this.generateEntityMutation(entity, entityConfig);
      allMutations.push(mutation);
    }

    // Write combined mutation file
    const combinedMutation = this.createCombinedMutation(allMutations);
    const outputPath = path.join(OUTPUT_DIR, 'seed-generated.gql');
    fs.writeFileSync(outputPath, combinedMutation, 'utf8');

    console.log(`\n✅ Seed file generated: ${outputPath}`);
    console.log(`   Execute with: npm run seed:execute\n`);

    return outputPath;
  }

  generateEntityMutation(entity, config) {
    // Check if using static data
    if (config.useStaticData) {
      return this.generateFromStaticData(entity, config);
    }

    // Generate dynamic data
    const records = [];
    for (let i = 0; i < config.count; i++) {
      const record = this.generateRecord(entity, i, config);
      records.push(record);

      // Track created ID for relationships
      if (record.id) {
        this.generators.trackCreatedEntity(entity.name, record.id);
      }
    }

    return this.formatMutation(entity.name, records);
  }

  generateRecord(entity, index, config) {
    const record = {};

    // Use mapped user data if available for User entity
    if (entity.name === 'User' && this.userMapping) {
      const userKeys = Object.keys(this.userMapping);
      if (index < userKeys.length) {
        const key = userKeys[index];
        const mapped = this.userMapping[key];
        return {
          id: mapped.uid,
          email: mapped.email,
          displayName: mapped.displayName,
          role: mapped.role,
          createdAt_expr: 'request.time',
          updatedAt_expr: 'request.time'
        };
      }
    }

    for (const field of entity.fields) {
      // Skip if field has _expr suffix (will be added later)
      if (field.name.endsWith('_expr')) continue;

      const context = {
        entityName: entity.name,
        index,
        ...config,
      };

      // Handle relationships by generating foreign key fields
      if (field.isRelationship) {
        const foreignKeyName = `${field.name}Id`;
        const relatedIds = this.generators.getCreatedIds(field.type);

        if (relatedIds.length > 0) {
          const { faker } = require('@faker-js/faker');
          record[foreignKeyName] = faker.helpers.arrayElement(relatedIds);
        } else if (field.required) {
          console.warn(`Warning: Required relationship ${field.name} → ${field.type} but no IDs available`);
        }
        continue;
      }

      const value = this.generators.generate(field, entity.name, context);

      if (value !== null && value !== undefined) {
        // Use _expr suffix for timestamp fields
        if (value === 'request.time') {
          record[`${field.name}_expr`] = 'request.time';
        } else {
          record[field.name] = value;
        }
      }
    }

    return record;
  }

  generateFromStaticData(entity, config) {
    const dataFile = path.join(STATIC_DATA_DIR, `${entity.name.toLowerCase()}s.json`);

    if (!fs.existsSync(dataFile)) {
      console.warn(`   ⚠️  Static data file not found: ${dataFile}`);
      return '';
    }

    const staticData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    const records = staticData.slice(0, config.count);

    console.log(`   📄 Using static data (${records.length} records)`);

    // Add auto-generated IDs and track them
    const recordsWithIds = records.map(record => {
      const { faker } = require('@faker-js/faker');
      const id = faker.string.uuid();
      this.generators.trackCreatedEntity(entity.name, id);
      return {
        ...record,
        id, // Auto-generate UUID for State
      };
    });

    return this.formatMutation(entity.name, recordsWithIds);
  }

  formatMutation(entityName, records) {
    if (records.length === 0) return '';

    const insertions = records.map((record, index) => {
      const alias = `${entityName.toLowerCase()}${index + 1}`;
      const dataStr = this.formatDataObject(record);
      return `  ${alias}: ${entityName.toLowerCase()}_insert(data: ${dataStr})`;
    }).join('\n');

    return insertions;
  }

  formatDataObject(obj, indent = 0) {
    const spaces = '  '.repeat(indent + 1);
    const entries = Object.entries(obj)
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([key, value]) => {
        if (typeof value === 'object' && !Array.isArray(value)) {
          return `${spaces}${key}: ${this.formatDataObject(value, indent + 1)}`;
        } else if (typeof value === 'string') {
          // All strings should be quoted in GraphQL
          return `${spaces}${key}: "${value}"`;
        } else {
          return `${spaces}${key}: ${value}`;
        }
      });

    return `{\n${entries.join('\n')}\n${'  '.repeat(indent)}}`;
  }

  createCombinedMutation(mutations) {
    const header = `# Auto-generated seed data for profile: ${this.profileName}
# Generated on: ${new Date().toISOString()}
# DO NOT EDIT - This file is auto-generated by scripts/seed/seed-generator.js

`;

    const mutationBody = `mutation SeedAll @auth(level: PUBLIC, insecureReason: "Test data seeding") {
${mutations.filter(Boolean).join('\n\n')}
}
`;

    return header + mutationBody;
  }
}

// CLI execution
if (require.main === module) {
  const profileName = process.argv[2] || 'basic';
  const generator = new SeedGenerator(profileName);

  generator.generate().catch(error => {
    console.error('❌ Seed generation failed:', error);
    process.exit(1);
  });
}

module.exports = SeedGenerator;
