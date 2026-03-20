import {
  takeEvery,
  fork,
  take,
  put,
  delay,
  race,
  call,
  cancel,
} from "redux-saga/effects";
import qs from "qs";
import axios from "axios";
import { Action } from "redux";

import { ApiRequestAction } from "@/src/redux-store/extra-actions/apis/api-builder";
import { apiBaseUrl } from "@/src/config";
import { actions } from "@/src/redux-store/slices";

function* ajaxTask(
  requestAction: ApiRequestAction<any>,
  abortController: AbortController,
): any {
  const { type, payload } = requestAction;
  const { params, options, prepareParams } = payload;
  const { path, method, body, query } = params;
  const api = type.replace("/request", "");

  yield put(
    actions.setApiLoading({
      api,
      isLoading: true,
    }),
  );

  try {
    if (options?.requestDelay) {
      const { timeout } = yield race({
        delay: delay(options.requestDelay),
        timeout: take(type),
      });
      if (timeout) {
        return;
      }
    }

    const { response } = yield race({
      response: call(() =>
        axios({
          url: options?.absolutePath ? path : `${apiBaseUrl}${path}`,
          method,
          data: body,
          params: query,
          paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: "repeat" }),
          signal: abortController.signal,
        }),
      ),
      timeout: take(type),
    });

    if (response) {
      yield put({
        type: `${api}/success`,
        payload: {
          status: response.status,
          data: response.data,
          prepareParams,
        },
      });
      yield put(
        actions.setApiLoading({
          api,
          isLoading: false,
        }),
      );
    }
  } catch (e) {
    if (!axios.isCancel(e) && axios.isAxiosError(e)) {
      const status = e?.response?.status || 500;
      const message: string = e?.response?.data?.message || e.message;
      yield put({
        type: `${api}/fail`,
        payload: {
          status,
          message,
          prepareParams,
        },
      });
      yield put(
        actions.setApiLoading({
          api,
          isLoading: false,
        }),
      );
    }
  }
}

const runningTasks: Record<
  string,
  { task: any; abortController: AbortController }
> = {};

export function* ajaxRequestSaga() {
  yield takeEvery(
    (action: Action) => /^apis\/(.*?)\/request$/.test(action.type),
    function* (requestAction: ApiRequestAction<any>) {
      const { type } = requestAction;
      const api = type.replace("/request", "");

      if (runningTasks[api]) {
        const { task: oldTask, abortController: oldAbortController } =
          runningTasks[api];
        oldAbortController.abort();
        yield cancel(oldTask);
      }

      const abortController = new AbortController();
      const task: any = yield fork(ajaxTask, requestAction, abortController);
      runningTasks[api] = { task, abortController };

      try {
        const resultAction: Action = yield take([
          `${api}/success`,
          `${api}/fail`,
          `${api}/cancel`,
        ]);

        if (resultAction.type === `${api}/cancel` && task && task.isRunning()) {
          abortController.abort();
          yield cancel(task);
        }
      } finally {
        if (runningTasks[api]?.task === task) {
          delete runningTasks[api];
        }
      }
    },
  );
}
