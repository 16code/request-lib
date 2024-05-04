/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-use-before-define */
type RequestHeaderValue = RequestHeaders | string | string[] | number | boolean | null;
// eslint-disable-next-line max-len
type ContentTypeDefaults = 'multipart/form-data' | 'application/json' | 'text/plain' | 'application/x-www-form-urlencoded' | 'multipart/byteranges' | 'text/xml';

interface RequestHeaderDefaults {
    'Content-Type'?: ContentTypeDefaults & string;
    'Content-Length'?: number;
    'Cache-Control'?: string;
}

type RawRequestHeaders = RequestHeaderDefaults & Record<string, RequestHeaderValue>;

type MethodsHeaders = {
  [Key in Method as Lowercase<Key>]: RequestHeaders;
};

interface CommonHeaders {
  common: RequestHeaders;
}

type RequestHeaderMatcher = (this: RequestHeaders, value: string, name: string, headers: RawRequestHeaders) => boolean;

type RequestHeaderSetter = (value: RequestHeaderValue, rewrite?: boolean | RequestHeaderMatcher) => RequestHeaders;

type RequestHeaderGetter = ((parser?: RegExp) => RegExpExecArray | null) |
    ((matcher?: RequestHeaderMatcher) => RequestHeaderValue);

type RequestHeaderTester = (matcher?: RequestHeaderMatcher) => boolean;

export class RequestHeaders {
    constructor(
      headers?: RawRequestHeaders | RequestHeaders
  );

    set(headerName?: string, value?: RequestHeaderValue, rewrite?: boolean | RequestHeaderMatcher): RequestHeaders;
    set(headers?: RawRequestHeaders | RequestHeaders, rewrite?: boolean): RequestHeaders;

    get(headerName: string, parser: RegExp): RegExpExecArray | null;
    get(headerName: string, matcher?: true | RequestHeaderMatcher): RequestHeaderValue;

    has(header: string, matcher?: true | RequestHeaderMatcher): boolean;

    delete(header: string | string[], matcher?: RequestHeaderMatcher): boolean;

    clear(): boolean;

    normalize(format: boolean): RequestHeaders;

    concat(...targets: Array<RequestHeaders | RawRequestHeaders | string>): RequestHeaders;

    toJSON(asStrings?: boolean): RawRequestHeaders;

    static from(thing?: RequestHeaders | RawRequestHeaders | string): RequestHeaders;

    static accessor(header: string | string[]): RequestHeaders;

    static concat(...targets: Array<RequestHeaders | RawRequestHeaders | string>): RequestHeaders;

    setContentType: RequestHeaderSetter;
    getContentType: RequestHeaderGetter;
    hasContentType: RequestHeaderTester;

    getContentDisposition: RequestHeaderGetter;
    hasContentDisposition: RequestHeaderTester;

    setContentLength: RequestHeaderSetter;
    getContentLength: RequestHeaderGetter;
    hasContentLength: RequestHeaderTester;

    setAccept: RequestHeaderSetter;
    getAccept: RequestHeaderGetter;
    hasAccept: RequestHeaderTester;

    setUserAgent: RequestHeaderSetter;
    getUserAgent: RequestHeaderGetter;
    hasUserAgent: RequestHeaderTester;

    setContentEncoding: RequestHeaderSetter;
    getContentEncoding: RequestHeaderGetter;
    hasContentEncoding: RequestHeaderTester;
}

export type RawRequestRequestHeaders = Partial<RawRequestHeaders & MethodsHeaders & CommonHeaders>;

export type RequestRequestHeaders = RawRequestRequestHeaders & RequestHeaders;

export type RawRequestResponseHeaders = Partial<Record<string, string> & {
  'set-cookie'?: string[]
}>;

export type RequestResponseHeaders = RawRequestResponseHeaders & RequestHeaders;

export interface RequestRequestTransformer {
  (this: RequestRequestConfig, data: any, headers: RequestRequestHeaders): any;
}

export interface RequestResponseTransformer {
  (this: RequestRequestConfig, data: any, headers: RequestResponseHeaders, status?: number): any;
}

export interface RequestAdapter {
  (config: RequestRequestConfig): RequestPromise;
}

export interface RequestBasicCredentials {
  username: string;
  password: string;
}

export interface RequestProxyConfig {
  host: string;
  port: number;
  auth?: {
    username: string;
    password: string;
  };
  protocol?: string;
}

export enum HttpStatusCode {
  Continue = 100,
  SwitchingProtocols = 101,
  Processing = 102,
  EarlyHints = 103,
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207,
  AlreadyReported = 208,
  ImUsed = 226,
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  Unused = 306,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  UriTooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  ImATeapot = 418,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  TooEarly = 425,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HttpVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511,
}

export type Method = 'GET' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH';

export type ResponseType =
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'json'
    | 'text'
    | 'stream';

export type responseEncoding =
    | 'ascii' | 'ASCII'
    | 'ansi' | 'ANSI'
    | 'binary' | 'BINARY'
    | 'base64' | 'BASE64'
    | 'base64url' | 'BASE64URL'
    | 'hex' | 'HEX'
    | 'latin1' | 'LATIN1'
    | 'ucs-2' | 'UCS-2'
    | 'ucs2' | 'UCS2'
    | 'utf-8' | 'UTF-8'
    | 'utf8' | 'UTF8'
    | 'utf16le' | 'UTF16LE';

export interface TransitionalOptions {
  silentJSONParsing?: boolean;
  forcedJSONParsing?: boolean;
  clarifyTimeoutError?: boolean;
}

export interface GenericAbortSignal {
  readonly aborted: boolean;
  onabort?: ((...args: any) => any) | null;
  addEventListener?: (...args: any) => any;
  removeEventListener?: (...args: any) => any;
}

export interface FormDataVisitorHelpers {
  defaultVisitor: SerializerVisitor;
  convertValue: (value: any) => any;
  isVisitable: (value: any) => boolean;
}

export interface SerializerVisitor {
  (
      this: GenericFormData,
      value: any,
      key: string | number,
      path: null | Array<string | number>,
      helpers: FormDataVisitorHelpers
  ): boolean;
}

export interface SerializerOptions {
  visitor?: SerializerVisitor;
  dots?: boolean;
  metaTokens?: boolean;
  indexes?: boolean | null;
}

// tslint:disable-next-line
export type FormSerializerOptions = SerializerOptions

export interface ParamEncoder {
  (value: any, defaultEncoder: (value: any) => any): any;
}

export interface CustomParamsSerializer {
  (params: Record<string, any>, options?: ParamsSerializerOptions): string;
}

export interface ParamsSerializerOptions extends SerializerOptions {
  encode?: ParamEncoder;
  serialize?: CustomParamsSerializer;
}

type MaxUploadRate = number;

type MaxDownloadRate = number;

type BrowserProgressEvent = any;

export interface RequestProgressEvent {
  loaded: number;
  total?: number;
  progress?: number;
  bytes: number;
  rate?: number;
  estimated?: number;
  upload?: boolean;
  download?: boolean;
  event?: BrowserProgressEvent;
}

type Milliseconds = number;

type RequestAdapterName = 'xhr' | 'http' | string;

type RequestAdapterConfig = RequestAdapter | RequestAdapterName;

export interface RawRequestRequestConfig<D = any> {
  url?: string;
  method?: Method;
  baseURL?: string;
  transformRequest?: RequestRequestTransformer | RequestRequestTransformer[];
  transformResponse?: RequestResponseTransformer | RequestResponseTransformer[];
  headers?: RawRequestRequestHeaders | RequestHeaders;
  params?: any;
  paramsSerializer?: ParamsSerializerOptions;
  data?: D;
  timeout?: Milliseconds;
  timeoutErrorMessage?: string;
  withCredentials?: boolean;
  adapter?: RequestAdapterConfig | RequestAdapterConfig[];
  auth?: RequestBasicCredentials;
  responseType?: ResponseType;
  responseEncoding?: responseEncoding | string;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  onUploadProgress?: (progressEvent: RequestProgressEvent) => void;
  onDownloadProgress?: (progressEvent: RequestProgressEvent) => void;
  maxContentLength?: number;
  validateStatus?: ((status: number) => boolean) | null;
  maxBodyLength?: number;
  maxRedirects?: number;
  maxRate?: number | [MaxUploadRate, MaxDownloadRate];
  beforeRedirect?: (options: Record<string, any>, responseDetails: {headers: Record<string, string>}) => void;
  socketPath?: string | null;
  httpAgent?: any;
  httpsAgent?: any;
  proxy?: RequestProxyConfig | false;
  decompress?: boolean;
  transitional?: TransitionalOptions;
  signal?: GenericAbortSignal;
  insecureHTTPParser?: boolean;
  env?: {
    FormData?: new (...args: any[]) => object;
  };
  formSerializer?: FormSerializerOptions;
}

export interface RequestRequestConfig<D = any> extends RawRequestRequestConfig {
  headers: RequestRequestHeaders;
}

export interface HeadersDefaults {
  common: RawRequestRequestHeaders;
  delete: RawRequestRequestHeaders;
  get: RawRequestRequestHeaders;
  head: RawRequestRequestHeaders;
  post: RawRequestRequestHeaders;
  put: RawRequestRequestHeaders;
  patch: RawRequestRequestHeaders;
  options?: RawRequestRequestHeaders;
  purge?: RawRequestRequestHeaders;
  link?: RawRequestRequestHeaders;
  unlink?: RawRequestRequestHeaders;
}

export interface RequestDefaults<D = any> extends Omit<RawRequestRequestConfig<D>, 'headers'> {
  headers: HeadersDefaults;
}

export interface CreateRequestDefaults<D = any> extends Omit<RawRequestRequestConfig<D>, 'headers'> {
  headers?: RawRequestRequestHeaders | RequestHeaders | Partial<HeadersDefaults>;
}

export interface RequestResponse<T = any, D = any> {
  data: T;
  status: number;
  statusText: string;
  headers: RawRequestResponseHeaders | RequestResponseHeaders;
  config: RequestRequestConfig<D>;
  request?: any;
}

export class RequestError<T = unknown, D = any> extends Error {
    constructor(
      message?: string,
      code?: string,
      config?: RequestRequestConfig<D>,
      request?: any,
      response?: RequestResponse<T, D>
  );

    config?: RequestRequestConfig<D>;
    code?: string;
    request?: any;
    response?: RequestResponse<T, D>;
    isRequestError: boolean;
    status?: number;
    toJSON: () => object;
    cause?: Error;
    static from<T = unknown, D = any>(
    error: Error | unknown,
    code?: string,
    config?: RequestRequestConfig<D>,
    request?: any,
    response?: RequestResponse<T, D>,
    customProps?: object,
): RequestError<T, D>;
    static readonly ERR_FR_TOO_MANY_REDIRECTS = 'ERR_FR_TOO_MANY_REDIRECTS';
    static readonly ERR_BAD_OPTION_VALUE = 'ERR_BAD_OPTION_VALUE';
    static readonly ERR_BAD_OPTION = 'ERR_BAD_OPTION';
    static readonly ERR_NETWORK = 'ERR_NETWORK';
    static readonly ERR_DEPRECATED = 'ERR_DEPRECATED';
    static readonly ERR_BAD_RESPONSE = 'ERR_BAD_RESPONSE';
    static readonly ERR_BAD_REQUEST = 'ERR_BAD_REQUEST';
    static readonly ERR_NOT_SUPPORT = 'ERR_NOT_SUPPORT';
    static readonly ERR_INVALID_URL = 'ERR_INVALID_URL';
    static readonly ERR_CANCELED = 'ERR_CANCELED';
    static readonly ECONNABORTED = 'ECONNABORTED';
    static readonly ETIMEDOUT = 'ETIMEDOUT';
}

export class CanceledError<T> extends RequestError<T> {
}

export type RequestPromise<T = any> = Promise<RequestResponse<T>>;

export interface CancelStatic {
  new (message?: string): Cancel;
}

export interface Cancel {
  message: string | undefined;
}

export interface Canceler {
  (message?: string, config?: RawRequestRequestConfig, request?: any): void;
}

export interface RequestInterceptorOptions {
  synchronous?: boolean;
  runWhen?: (config: RequestRequestConfig) => boolean;
}

export interface RequestInterceptorManager<V> {
  use(onFulfilled?: ((value: V) => V | Promise<V>) | null, onRejected?: ((error: any) => any) | null, options?: RequestInterceptorOptions): number;
  eject(id: number): void;
  clear(): void;
}

export class Request {
    constructor(config?: RawRequestRequestConfig);
    defaults: RequestDefaults;
    interceptors: {
    request: RequestInterceptorManager<RequestRequestConfig>;
    response: RequestInterceptorManager<RequestResponse>;
  };
    request<T = any, R = RequestResponse<T>, D = any>(config: RawRequestRequestConfig<D>): Promise<R>;
}

export interface RequestInstance extends Request {
  <T = any, R = RequestResponse<T>, D = any>(url: string, config?: RawRequestRequestConfig<D>): Promise<R>;

  defaults: Omit<RequestDefaults, 'headers'> & {
    headers: HeadersDefaults & {
      [key: string]: RequestHeaderValue
    }
  };
}

export interface GenericFormData {
  append(name: string, value: any, options?: any): any;
}

export interface GenericHTMLFormElement {
  name: string;
  method: string;
  submit(): void;
}

export function toFormData(sourceObj: object, targetFormData?: GenericFormData, options?: FormSerializerOptions): GenericFormData;

export function formToJSON(form: GenericFormData|GenericHTMLFormElement): object;

export function isRequestError<T = any, D = any>(payload: any): payload is RequestError<T, D>;

export function spread<T, R>(callback: (...args: T[]) => R): (array: T[]) => R;

export function isCancel(value: any): value is Cancel;

export function all<T>(values: Array<T | Promise<T>>): Promise<T[]>;

export interface RequestStatic extends RequestInstance {
  create(config?: CreateRequestDefaults): RequestInstance;
  readonly VERSION: string;
  Request: typeof Request;
  RequestError: typeof RequestError;
  isCancel: typeof isCancel;
  all: typeof all;
  spread: typeof spread;
  isRequestError: typeof isRequestError;
  CanceledError: typeof CanceledError;
}

declare const request: RequestStatic;

export default request;
