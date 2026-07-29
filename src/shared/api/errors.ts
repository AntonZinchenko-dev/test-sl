export interface ProblemDetail {
  code: string;
  title: string;
  message: string;
  trace_id?: string | null;
}

export interface ValidationErrorItem {
  field: string;
  message: string;
  code?: string | null;
}

export interface ValidationProblem extends ProblemDetail {
  errors: ValidationErrorItem[];
}

export class ApiError extends Error {
  status: number;
  problem: ProblemDetail;

  constructor(status: number, problem: ProblemDetail) {
    super(problem.message);
    this.status = status;
    this.problem = problem;
  }

  isValidation(): this is ApiError & { problem: ValidationProblem } {
    return this.status === 422 && this.problem.code === 'validation_failed';
  }
}
