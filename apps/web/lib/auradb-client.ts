import neo4j, { Driver, Session, Result } from 'neo4j-driver';
import { driver } from './db';

// Get AuraDB driver instance (use the existing driver from db/index.ts)
export function getAuraDBDriver(): Driver {
  return driver;
}

// Test AuraDB connection
export async function testConnection(): Promise<boolean> {
  const session = getAuraDBDriver().session();
  
  try {
    const result = await session.run('RETURN "Connection successful" as message');
    const message = result.records[0]?.get('message');
    
    if (message === 'Connection successful') {
      console.log('✅ AuraDB connection test passed');
      return true;
    } else {
      console.error('❌ AuraDB connection test failed: unexpected response');
      return false;
    }
  } catch (error) {
    console.error('❌ AuraDB connection test failed:', error);
    return false;
  } finally {
    await session.close();
  }
}

// Utility function to convert Neo4j integers to JavaScript numbers
export function neo4jIntToNumber(value: any): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  
  if (typeof value === 'number') {
    return value;
  }
  
  // Handle Neo4j Integer type
  if (value && typeof value.toNumber === 'function') {
    return value.toNumber();
  }
  
  return parseInt(value);
}

// Utility function to safely extract record values
export function extractRecordValue(record: any, key: string): any {
  try {
    const value = record.get(key);
    
    // Handle Neo4j Integer types
    if (value && typeof value.toNumber === 'function') {
      return value.toNumber();
    }
    
    // Handle arrays of Neo4j objects
    if (Array.isArray(value)) {
      return value.map(item => 
        (item && typeof item.toNumber === 'function') ? item.toNumber() : item
      );
    }
    
    return value;
  } catch (error) {
    console.warn(`Warning: Could not extract value for key "${key}":`, error);
    return null;
  }
}

// Data validation utilities
export function validateUserProfileData(userProfile: any): boolean {
  if (!userProfile) {
    console.error('User profile data is required');
    return false;
  }

  if (!userProfile.userId) {
    console.error('User ID is required');
    return false;
  }

  if (!userProfile.name && !userProfile.firstName && !userProfile.lastName) {
    console.error('User name is required');
    return false;
  }

  return true;
}

export function validateProjectData(project: any): boolean {
  if (!project) {
    console.error('Project data is required');
    return false;
  }

  if (!project.project_name) {
    console.error('Project name is required');
    return false;
  }

  return true;
}

// Error handling utilities
export class AuraDBError extends Error {
  constructor(
    message: string,
    public originalError?: any,
    public query?: string,
    public parameters?: any
  ) {
    super(message);
    this.name = 'AuraDBError';
  }
}

export function handleAuraDBError(error: any, context?: string): AuraDBError {
  const message = context 
    ? `AuraDB Error in ${context}: ${error.message || error}`
    : `AuraDB Error: ${error.message || error}`;
    
  return new AuraDBError(message, error);
}