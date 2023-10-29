const sortByTimestamp = (a: any, b: any, desc: boolean = false) => {
  if (desc) {
    return b.updatedAt.localeCompare(a.updatedAt);
  } else {
    return a.updatedAt.localeCompare(b.updatedAt);
  }
};

export { sortByTimestamp };
