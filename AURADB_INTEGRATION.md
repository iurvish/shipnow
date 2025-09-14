# AuraDB Integration for ShipNow

This document describes the AuraDB (Neo4j) integration for AI-powered user and project search.

## Environment Variables

Add these variables to your `.env.local` file:

```env
# AuraDB Connection
NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io
NEO4J_USERNAME=your-username
NEO4J_PASSWORD=your-password
```

### How to get AuraDB credentials:

1. Go to [Neo4j AuraDB](https://neo4j.com/cloud/aura/)
2. Create a free account and new database instance
3. Copy the connection URI, username, and password
4. Add them to your environment variables

## Features

### Data Synchronization

The integration automatically syncs data to AuraDB when:

- A user completes onboarding
- A project is created, updated, or deleted

### Graph Schema

The graph database stores:

- **Users**: Profile information, skills, education
- **Projects**: Project details, tags, features
- **Skills**: Individual skills users have
- **Universities**: Educational institutions
- **Departments**: Academic departments
- **Tags**: Project categorization tags
- **Features**: Project key features

### Relationships

- Users have skills: `(:User)-[:HAS_SKILL]->(:Skill)`
- Users studied at universities: `(:User)-[:STUDIED_AT]->(:University)`
- Users belong to departments: `(:User)-[:IN_DEPARTMENT]->(:Department)`
- Users built projects: `(:User)-[:BUILT]->(:Project)`
- Projects have tags: `(:Project)-[:HAS_TAG]->(:Tag)`
- Projects have features: `(:Project)-[:HAS_FEATURE]->(:Feature)`

## API Endpoints

### GET /api/search

Search for users using various criteria:

#### Find users by skills:

```
GET /api/search?type=skills&query=React,TypeScript&limit=10
```

#### Find users by project tags:

```
GET /api/search?type=project-tags&query=AI,Chatbot&limit=10
```

#### Find designers:

```
GET /api/search?type=designers&limit=10
```

#### Find testers:

```
GET /api/search?type=testers&limit=10
```

#### Find security experts:

```
GET /api/search?type=security-experts&limit=10
```

### POST /api/search

Advanced search with more complex queries:

```javascript
const response = await fetch("/api/search", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    searchType: "skills",
    query: ["React", "Node.js", "TypeScript"],
    filters: {},
    limit: 20,
  }),
});
```

## Error Handling

The integration includes robust error handling:

- AuraDB connection failures don't break the main application
- Sync failures are logged but don't prevent Supabase operations
- Connection testing ensures queries only run when AuraDB is available

## Search Examples

Here are example search queries that are now possible:

1. **Find React developers**: Search for users with React skills
2. **Find AI project builders**: Search for users who built projects tagged with "AI"
3. **Find UI/UX designers**: Search for users with design-related skills or features
4. **Find testers**: Search for users with testing/QA skills
5. **Find ethical hackers**: Search for users with security/hacking skills

## Implementation Files

- `lib/auradb-client.ts` - Connection and query execution utilities
- `lib/auradb-queries.ts` - Cypher queries for all operations
- `lib/auradb-service.ts` - High-level service functions and data transformation
- `lib/onboarding.ts` - Updated to sync onboarding data
- `lib/actions/projects.ts` - Updated to sync project CRUD operations
- `app/api/search/route.ts` - REST API for search functionality

## Testing the Integration

1. Complete the onboarding process for a user
2. Create some projects with various tags and features
3. Test the search endpoints:
   ```bash
   curl "http://localhost:3000/api/search?type=skills&query=React"
   curl "http://localhost:3000/api/search?type=project-tags&query=AI"
   curl "http://localhost:3000/api/search?type=designers"
   ```

## Performance Considerations

- Queries are optimized with proper indexing on key properties
- Connection pooling is configured for production workloads
- Batch operations minimize database round trips
- Error handling ensures graceful degradation

## Security

- All database credentials are stored in environment variables
- Queries use parameterized statements to prevent injection
- Connection uses encrypted transport (neo4j+s protocol)
- No sensitive user data is exposed in search results
