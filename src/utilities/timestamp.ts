function timestamp(): string {
  return new Date().toLocaleString().replace(",", "");
}

export default timestamp;