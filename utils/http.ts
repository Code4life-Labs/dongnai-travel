
export type HTTPMethods = "post" | "get" | "put" | "delete" | "patch";

export type HTTPStatus = {
  title: string;
  message?: string;
}

export class HTTPUtil {
  static Methods = {
    get: "get",
    post: "post",
    put: "put",
    delete: "delete",
    patch: "patch"
  };
  static StatusCodes: { [key: number]: HTTPStatus } = {
    200: {
      title: "OK"
    },
    201: {
      title: "Created"
    },
    202: {
      title: "Accepted"
    },
    203: {
      title: "Non-Authoritative Information"
    },
    204: {
      title: "No Content"
    },
    205: {
      title: "Reset Content"
    },
    206: {
      title: "Partial Content"
    },
    207: {
      title: "Multi-Status"
    },
    208: {
      title: "Already Reported"
    },
    226: {
      title: "IM Used"
    },
    400: {
      title: "Bad Request"
    },
    401: {
      title: "Unauthorized"
    },
    402: {
      title: "Payment Required"
    },
    403: {
      title: "Forbidden"
    },
    404: {
      title: "Not Found"
    },
    405: {
      title: "Method Not Allowed"
    },
    406: {
      title: "Not Acceptable"
    },
    407: {
      title: "Proxy Authentication Required"
    },
    408: {
      title: "Request Timeout"
    },
    409: {
      title: "Conflict"
    },
    410: {
      title: "Gone"
    },
    411: {
      title: "Length Required"
    },
    412: {
      title: "Prediction Failed"
    },
    413: {
      title: "Payload Too Large"
    },
    414: {
      title: "URI Too Long"
    },
    415: {
      title: "Unsupported Media Type"
    },
    429: {
      title: "Too Many Request"
    },
    500: {
      title: "Internal Server Error"
    }
  };

  isValidHTTPMethod(method: HTTPMethods) {
    return Boolean(HTTPUtil.Methods[method]);
  }
}