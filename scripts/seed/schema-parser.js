const fs = require('fs');
const path = require('path');

/**
 * Parse GraphQL schema to extract entity definitions
 */
class SchemaParser {
  constructor(schemaPath) {
    this.schemaPath = schemaPath;
    this.schema = fs.readFileSync(schemaPath, 'utf8');
    this.entities = [];
  }

  parse() {
    const typeRegex = /type\s+(\w+)\s+@table(?:\([^)]*\))?\s*\{([^}]+)\}/g;
    let match;

    while ((match = typeRegex.exec(this.schema)) !== null) {
      const entityName = match[1];
      const fieldsBlock = match[2];

      const entity = {
        name: entityName,
        fields: this.parseFields(fieldsBlock),
      };

      this.entities.push(entity);
    }

    return this.entities;
  }

  parseFields(fieldsBlock) {
    const fields = [];
    const fieldLines = fieldsBlock.split('\n').map(line => line.trim()).filter(Boolean);

    for (const line of fieldLines) {
      // Skip comments
      if (line.startsWith('#') || line.startsWith('//')) continue;

      // Parse field definition: fieldName: Type! or fieldName: RelationType
      const fieldMatch = line.match(/^(\w+):\s*(\w+)(!)?/);
      if (!fieldMatch) continue;

      const [, fieldName, fieldType, required] = fieldMatch;

      fields.push({
        name: fieldName,
        type: fieldType,
        required: !!required,
        isRelationship: this.isRelationshipType(fieldType),
      });
    }

    return fields;
  }

  isRelationshipType(type) {
    // If the type is capitalized and not a built-in GraphQL type, it's likely a relationship
    const builtInTypes = ['String', 'Int', 'Float', 'Boolean', 'ID', 'Date', 'Timestamp', 'UUID'];
    return !builtInTypes.includes(type) && /^[A-Z]/.test(type);
  }

  getEntities() {
    return this.entities;
  }

  getEntityByName(name) {
    return this.entities.find(e => e.name === name);
  }

  // Build dependency order for seeding (entities with no dependencies first)
  getDependencyOrder() {
    const order = [];
    const remaining = [...this.entities];
    const added = new Set();

    while (remaining.length > 0) {
      let progressMade = false;

      for (let i = remaining.length - 1; i >= 0; i--) {
        const entity = remaining[i];
        const dependencies = entity.fields
          .filter(f => f.isRelationship && f.required)
          .map(f => f.type);

        // Check if all dependencies are already added
        const allDepsAdded = dependencies.every(dep => added.has(dep));

        if (allDepsAdded) {
          order.push(entity);
          added.add(entity.name);
          remaining.splice(i, 1);
          progressMade = true;
        }
      }

      // Prevent infinite loop if there are circular dependencies
      if (!progressMade && remaining.length > 0) {
        console.warn('Warning: Circular dependencies detected. Adding remaining entities:', remaining.map(e => e.name));
        order.push(...remaining);
        break;
      }
    }

    return order;
  }
}

module.exports = SchemaParser;
