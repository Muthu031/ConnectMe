/**
 * Repository Interface - Data Access Layer abstraction
 */

export interface IRepository<T, CreateInput, UpdateInput> {
  create(data: CreateInput): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(options?: { limit?: number; offset?: number }): Promise<T[]>;
  update(id: string, data: Partial<UpdateInput>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  findOne(condition: Record<string, unknown>): Promise<T | null>;
  findMany(condition: Record<string, unknown>): Promise<T[]>;
  exists(condition: Record<string, unknown>): Promise<boolean>;
}

/**
 * Base Repository - Template for all repositories
 */
export abstract class BaseRepository<T, CreateInput, UpdateInput>
  implements IRepository<T, CreateInput, UpdateInput> {
  abstract create(data: CreateInput): Promise<T>;
  abstract findById(id: string): Promise<T | null>;
  abstract findAll(options?: { limit?: number; offset?: number }): Promise<T[]>;
  abstract update(id: string, data: Partial<UpdateInput>): Promise<T | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract findOne(condition: Record<string, unknown>): Promise<T | null>;
  abstract findMany(condition: Record<string, unknown>): Promise<T[]>;
  abstract exists(condition: Record<string, unknown>): Promise<boolean>;
}
