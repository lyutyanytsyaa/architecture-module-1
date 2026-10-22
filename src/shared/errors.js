export class DomainError extends Error {
  constructor(message, code, status = 400) {
    super(message);
    this.name = "DomainError";
    this.code = code;
    this.status = status;
  }
}

export class ExternalDependencyError extends Error {
  constructor(message, dependency, cause) {
    super(message, { cause });
    this.name = "ExternalDependencyError";
    this.code = "EXTERNAL_DEPENDENCY_FAILED";
    this.status = 503;
    this.dependency = dependency;
  }
}
