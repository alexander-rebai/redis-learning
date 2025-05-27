# Redis Cheat Sheet - Restaurant API Project

## Project Overview

This project demonstrates a restaurant API built with Redis as the primary data store, showcasing various Redis data structures and their practical applications.

### API Endpoints

#### Cuisines

1. **GET /cuisines**

   - Retrieves all cuisines

2. **GET /cuisines/:cuisine**
   - Retrieves all restaurants for a specific cuisine

#### Restaurants

1. **GET /restaurants/search**

   - Searches for restaurants by name

2. **POST /restaurants**

   - Creates a new restaurant

3. **GET /restaurants**

   - Retrieves paginated list of restaurants sorted by rating

4. **POST /restaurants/:id/reviews**

   - Adds a new review for a restaurant

5. **GET /restaurants/:id/reviews**

   - Retrieves paginated list of reviews for a restaurant

6. **DELETE /restaurants/:restaurantId/reviews/:reviewId**

   - Deletes a specific review for a restaurant

7. **GET /restaurants/:restaurantId/weather**

   - Retrieves weather information for a restaurant's location

8. **GET /restaurants/:id**
   - Retrieves details of a specific restaurant

## Why Redis?

- **In-memory data store** - Extremely fast data access
- **Good as a cache** - Perfect for frequently accessed data
- **Performant** - Sub-millisecond response times

### Cache Strategy

1. **Cache-hit** - Use data in cache
2. **Cache-miss** - Read data from source (database)
3. **Write to Cache** - Store frequently accessed data

## Redis Features Used

1. **Hashes**
2. **Lists**
3. **Sets**
4. **Sorted Sets**
5. **Strings**
6. **RedisJSON**
7. **RediSearch**
8. **Bloom Filters**

## Redis Data Structures

### 1. Hashes

**Description:**

- Field-value pairs
- Represent basic objects, counters, etc.
- No nested data (arrays/objects)
- Fields added and removed as needed

**Example:**

```
Key: restaurant:1
├── id: 1
├── name: Better Food
└── rating: 5
```

**Common Commands:**

- `HSET` - sets the value of one or more fields on a hash
- `HGET` - returns the value at a given field
- `HGETALL` - returns all fields and values of the hash stored at key
- `HMGET` - returns the values at one or more given fields
- `HINCRBY` - increments the value at a given field by the integer provided

---

### 2. Lists

**Description:**

- Linked list of string values
- Optimized for adding/removing at head/tail

**Example:**

```
Key: reviews:restaurant1
├── Index 0: AHF3UGNWy2
├── Index 1: AHF3UGNWy2
└── Index 2: AHF3UGNWy3
```

**Common Commands:**

- `LPUSH/RPUSH` - adds a new element to the head/tail
- `LPOP/RPOP` - removes and returns an element from the head/tail of a list
- `LLEN` - returns the length of a list
- `LMOVE` - atomically moves elements from one list to another
- `LRANGE` - extracts a range of elements from a list
- `LTRIM` - reduces a list to the specified range of elements

---

### 3. Sets

**Description:**

- Unordered collection
- Unique strings

**Example:**

```
Key: cuisines
├── Italian
├── Japanese
├── Mexican
└── Indian
```

**Common Commands:**

- `SADD` - adds a new member to a set
- `SREM` - removes the specified member from the set
- `SISMEMBER` - tests a string for set membership
- `SINTER` - returns the set of members that two or more sets have in common (intersection)
- `SCARD` - returns the size (cardinality) of a set

---

### 4. Sorted Sets

**Description:**

- Unique strings
- Ordered by a "Score"
- Perfect for leaderboards

**Example:**

```
Key: restaurants:by_rating
├── restaurant1: 3.5
├── restaurant2: 4
└── restaurant3: 5
```

**Common Commands:**

- `ZADD` - adds a new member and associated score to a sorted set. If the member already exists, the score is updated
- `ZRANGE` - returns members of a sorted set, sorted within a given range
- `ZRANK` - returns the rank of the provided member, assuming the sorted set is in ascending order
- `ZREVRANK` - returns the rank of the provided member, assuming the sorted set is in descending order

## Technology Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Zod** - Schema validation
- **TypeScript** - Type safety
- **node-redis** - Redis client for Node.js

## Data Examples

### Restaurant Hash Example

```redis
HSET restaurant:1 id 1 name "Better Food" rating 5
```

### Cuisine Set Example

```redis
SADD cuisines Italian Japanese Mexican Indian
```

### Restaurant by Rating Sorted Set

```redis
ZADD restaurants:by_rating 3.5 restaurant1 4 restaurant2 5 restaurant3
```

### Restaurant Cuisines Set

```redis
SADD restaurant_cuisines:restaurant1 Italian Mexican
```

### Reviews List

```redis
LPUSH reviews:restaurant1 "AHF3UGNWy2" "AHF3UGNWy3"
```

This cheat sheet demonstrates how Redis can be effectively used in a real-world application, providing fast, scalable data storage and retrieval for a restaurant API system.
