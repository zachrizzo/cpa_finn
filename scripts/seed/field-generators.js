const { faker } = require('@faker-js/faker');

/**
 * Smart field value generators based on field names and types
 */
class FieldGenerators {
  constructor() {
    this.createdIds = new Map(); // Track created IDs for relationships
  }

  /**
   * Generate a value for a field based on its name and type
   */
  generate(field, entityName, context = {}) {
    // Skip relationships - they're represented as foreign keys in the database
    // The actual column will be {relationshipName}Id
    if (field.isRelationship) {
      return null; // Skip - will use userId, stateId, etc. instead
    }

    // Try field name-specific generators first
    const nameGenerator = this.getNameGenerator(field.name, context);
    if (nameGenerator !== null) {
      return nameGenerator;
    }

    // Fall back to type-based generators
    return this.getTypeGenerator(field.type, field.name, context);
  }

  /**
   * Get generator based on field name patterns
   */
  getNameGenerator(fieldName, context) {
    const lowerName = fieldName.toLowerCase();

    // Exact matches
    if (fieldName === 'id') {
      // User.id is String, others might be UUID - just generate UUID without prefix
      return faker.string.uuid();
    }
    if (fieldName === 'email') return faker.internet.email();
    if (fieldName === 'displayName') return faker.person.fullName();
    if (fieldName === 'firstName') return faker.person.firstName();
    if (fieldName === 'lastName') return faker.person.lastName();

    // Foreign key fields (userId, stateId, etc.)
    if (fieldName === 'userId') {
      const userIds = this.getCreatedIds('User');
      return userIds.length > 0 ? faker.helpers.arrayElement(userIds) : null;
    }
    if (fieldName === 'stateId') {
      const stateIds = this.getCreatedIds('State');
      return stateIds.length > 0 ? faker.helpers.arrayElement(stateIds) : null;
    }

    // Role-specific
    if (fieldName === 'role') {
      return context.role || faker.helpers.arrayElement(['np', 'physician']);
    }

    // Medical/Healthcare specific
    if (fieldName === 'licenseNumber') {
      const state = context.state || 'CA';
      return `${state}${faker.string.numeric(6)}`;
    }
    if (fieldName === 'licenseType') {
      const role = context.role || 'np';
      return role === 'np' ? 'Nurse Practitioner (NP)' : 'Medical Doctor (MD)';
    }

    // Status fields
    if (lowerName.includes('status')) {
      return context.statusOptions
        ? faker.helpers.arrayElement(context.statusOptions)
        : 'active';
    }

    // State codes
    if (fieldName === 'stateCode') return faker.location.state({ abbreviated: true });
    if (fieldName === 'stateName') return faker.location.state();

    // Pattern matching for timestamps
    if (fieldName.endsWith('At') || fieldName.endsWith('Date')) {
      return 'request.time';
    }

    // IDs ending patterns
    if (fieldName.endsWith('Id') && !fieldName.endsWith('mediaId')) {
      return null; // Will be handled as relationship or UUID
    }

    return null; // No specific generator
  }

  /**
   * Get generator based on GraphQL type
   */
  getTypeGenerator(type, fieldName, context) {
    switch (type) {
      case 'String':
        return faker.lorem.words(2);
      case 'Int':
        return faker.number.int({ min: 0, max: 1000 });
      case 'Float':
        return faker.number.float({ min: 0, max: 100, multipleOf: 0.01 });
      case 'Boolean':
        return faker.datatype.boolean();
      case 'Date':
        return faker.date.recent({ days: 365 }).toISOString().split('T')[0];
      case 'Timestamp':
        return 'request.time';
      case 'UUID':
        return faker.string.uuid();
      default:
        return null;
    }
  }

  /**
   * Handle relationship fields
   * Returns the appropriate key format for Data Connect
   */
  generateRelationship(field, context) {
    const relatedEntityName = field.type;
    const createdEntities = this.createdIds.get(relatedEntityName);

    if (!createdEntities || createdEntities.length === 0) {
      // No entities of this type created yet
      if (field.required) {
        console.warn(`Warning: Required relationship ${field.name} → ${relatedEntityName} but no entities created yet`);
      }
      return null;
    }

    // Randomly select from created entities
    const selectedId = faker.helpers.arrayElement(createdEntities);

    // Format as key object based on entity type
    // State uses stateCode, others use id
    if (relatedEntityName === 'State') {
      return { stateCode: selectedId };
    } else if (relatedEntityName === 'User') {
      return { id: selectedId };
    } else {
      // Default to id key
      return { id: selectedId };
    }
  }

  /**
   * Track created entity IDs for relationship generation
   */
  trackCreatedEntity(entityName, id) {
    if (!this.createdIds.has(entityName)) {
      this.createdIds.set(entityName, []);
    }
    this.createdIds.get(entityName).push(id);
  }

  /**
   * Get all created IDs for an entity type
   */
  getCreatedIds(entityName) {
    return this.createdIds.get(entityName) || [];
  }
}

module.exports = FieldGenerators;
