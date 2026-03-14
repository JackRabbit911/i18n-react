type Props = {
  status: number;
}

const getReasonPhrase = (status: number) => {
  switch (status) {
    case 400:
      return '400 | Bad request'
    case 401:
      return '401 | Unauthorized'
    case 403:
      return '403 | Forbidden'
    case 404:
      return '404 | Not found'
    case 500:
      return '500 | Internal server error'
    case 503:
      return '503 | Service Unavailable'
    case 555:
      return '555 | Invalid input data'
    default:
      return `${status} | Хз, что это...`
  }
}

const ErrorCmp = ({ status }: Props) => (
  <div className="w-full text-center">
    <div className="h-96 flex flex-col justify-center">
      <h1 className="text-center text-3xl">
        {getReasonPhrase(status)}
      </h1>
    </div>

  </div>
)

export default ErrorCmp
