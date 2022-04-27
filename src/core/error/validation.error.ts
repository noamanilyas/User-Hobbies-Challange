export default class ValidationError extends Error {
  public name = "ValidationError";

  public status = 400;
}
