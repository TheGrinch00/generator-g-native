import {
  apiActionBuilder,
  apiRequestPayloadBuilder,
  ApiRequestPayloadBuilderOptions,
  ApiSuccessAction,
  ApiFailAction,
  HttpMethod,
} from "../api-builder";

export interface GetSessionsMeParams {}
export interface GetSessionsMeResponseData {}
export default apiActionBuilder<
  GetSessionsMeParams,
  ApiSuccessAction<GetSessionsMeResponseData, GetSessionsMeParams>,
  ApiFailAction<GetSessionsMeParams>
>(
  "apis/sessions/me/get",
  (params: GetSessionsMeParams, options?: ApiRequestPayloadBuilderOptions) => ({
    payload: apiRequestPayloadBuilder<GetSessionsMeParams>(
      {
        path: "/sessions/me",
        method: HttpMethod.GET,
      },
      options ?? {
        requestDelay: 0,
      },
      params
    ),
  })
);
