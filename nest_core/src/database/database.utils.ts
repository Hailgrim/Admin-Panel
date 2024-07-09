import { FindOptions } from 'sequelize';

import { PaginationDto } from 'src/database/dto/pagination.dto';

/**
 * @param {any} paginationDto DTO with pagination attributes
 * @returns {FindOptions} Pagination options
 */
export const preparePaginationOptions = (
  paginationDto?: PaginationDto,
): FindOptions => {
  const options: FindOptions = { offset: 0, limit: 25 };
  if (
    paginationDto?.quantity &&
    paginationDto.quantity > 0 &&
    paginationDto.quantity <= 100
  ) {
    options.limit = paginationDto.quantity;
  }
  if (paginationDto?.page && paginationDto.page > 0 && options.limit) {
    options.offset = (paginationDto.page - 1) * options?.limit;
  }
  return options;
};
