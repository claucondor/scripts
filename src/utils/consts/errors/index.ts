type Errors = {
  NOT_FOUND: string;
  INTERNAL: string;
  BAD_REQUEST: string;
  CONFLICT: string;
  UNAUTHORIZED: string;
};

const errors: Errors = {
  NOT_FOUND: 'not_found',
  INTERNAL: 'internal',
  BAD_REQUEST: 'bad_request',
  CONFLICT: 'conflict',
  UNAUTHORIZED: 'unauthorized',
};

export { errors };
