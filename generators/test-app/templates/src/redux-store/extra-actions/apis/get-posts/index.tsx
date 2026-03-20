import {
  apiActionBuilder,
  apiRequestPayloadBuilder,
  ApiRequestPayloadBuilderOptions,
  ApiSuccessAction,
  ApiFailAction,
  HttpMethod,
} from "../api-builder";

export interface GetPostsParams {}
export interface GetPostsResponseData {
  userId: number;
  id: number;
  title: string;
  body: string;
}
export default apiActionBuilder<
  GetPostsParams,
  ApiSuccessAction<GetPostsResponseData[], GetPostsParams>,
  ApiFailAction<GetPostsParams>
>(
  "apis/posts/get",
  (
    params: GetPostsParams,
    options?: ApiRequestPayloadBuilderOptions,
  ) => ({
    payload: apiRequestPayloadBuilder<GetPostsParams>(
      {
        path: "/posts",
        method: HttpMethod.GET,
      },
      options,
      params,
    ),
  }),
);
