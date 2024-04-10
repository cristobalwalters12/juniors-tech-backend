const getPagination = ({ page, limit, total }) => {
  const totalPages = Math.ceil(total / limit)
  const prevPage = page <= 1 ? null : page - 1
  const nextPage = page >= totalPages ? null : page + 1
  return {
    totalMatches: total,
    totalPages,
    prevPage,
    currPage: page,
    nextPage,
    limit
  }
}

export { getPagination }
