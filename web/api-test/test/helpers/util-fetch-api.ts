import { ApiResponse } from '@frontend/types'
import { defaultResponseInterceptors, transformRequestData } from '@frontend/util/api'
import {
  FetchApi,
  FetchRequestConfig,
  IJsonObject,
  RequestInterceptor,
} from '@samatech/fetch-api'

export interface BasicFetchApiOptions {
  baseUrl: string
  timeout?: number
  requestInterceptors?: RequestInterceptor | RequestInterceptor[]
  responseInterceptors?: ((res: Response) => Promise<ApiResponse<IJsonObject>>)[]
}

export interface BasicFetchRequestConfig extends FetchRequestConfig {
  // This is needed because there appears to be a bug in Node's native fetch that
  // occasionally causes it to fail
  retries?: number
  // Transform dates in request data to string. Default true
  transform?: boolean
}

export class BasicFetchApi extends FetchApi<ApiResponse> {
  constructor(options: BasicFetchApiOptions) {
    const responseInterceptors = [
      ...(options.responseInterceptors ?? []),
      ...defaultResponseInterceptors,
    ]
    super({
      ...options,
      responseInterceptors,
    })
  }

  bearerRequest<T>(config: FetchRequestConfig, bearer: string): Promise<ApiResponse<T>> {
    const { headers, ...rest } = config
    return this.request<T>({
      ...rest,
      headers: {
        ...headers,
        Authorization: `Bearer ${bearer}`,
      },
    })
  }

  override async request<T>(config: BasicFetchRequestConfig): Promise<ApiResponse<T>> {
    const { retries, data, transform, timeout, ...rest } = config
    const finalConfig: FetchRequestConfig = {
      ...rest,
      requestJson: transform,
      data: transform ? transformRequestData(data as Record<string, unknown>) : data,
      mode: 'cors',
    }
    const runRequest = (): Promise<ApiResponse<T>> => {
      if (!timeout) {
        return super.request(finalConfig) as Promise<ApiResponse<T>>
      }
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), timeout)
      return super
        .request({ ...finalConfig, signal: controller.signal })
        .finally(() => clearTimeout(timer)) as Promise<ApiResponse<T>>
    }
    let requestPromise = runRequest()
    if (!retries) {
      return requestPromise as Promise<ApiResponse<T>>
    }
    for (let i = 0; i < retries; i += 1) {
      try {
        const result = await requestPromise
        return result as ApiResponse<T>
      } catch (err) {
        const e = err as Record<string, unknown>
        console.log(`Request failed: ${this.baseUrl}${config.url}, try=${i + 1}, ${e}`)
        if ('body' in e) {
          console.log(e.body)
        }
      }
      requestPromise = runRequest()
    }
    throw new Error(`Request failed, retries exhausted: ${retries}`)
  }

  async get(url: string): Promise<ApiResponse> {
    return this.request({ url, retries: 3 })
  }
}
