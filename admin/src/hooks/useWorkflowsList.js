import { useEffect, useReducer, useRef } from "react";
import produce from "immer";
import { request } from "strapi-helper-plugin";
import { get } from "lodash";
import pluginId from "../pluginId";

const initialState = {
  workflows: [],
  isLoading: true,
};

const reducer = (state, action) =>
  produce(state, (draftState) => {
    switch (action.type) {
      case "GET_DATA": {
        draftState.isLoading = true;
        draftState.workflows = [];
        break;
      }
      case "GET_DATA_SUCCEEDED": {
        draftState.workflows = action.data;
        draftState.isLoading = false;
        break;
      }
      case "GET_DATA_ERROR": {
        draftState.isLoading = false;
        break;
      }
      default:
        return draftState;
    }
  });

const useWorkflowsList = (shouldFetchData = true) => {
  const [{ workflows, isLoading }, dispatch] = useReducer(
    reducer,
    initialState,
    () => ({ ...initialState, isLoading: shouldFetchData })
  );

  const isMounted = useRef(true);
  const abortController = new AbortController();
  const { signal } = abortController;

  useEffect(() => {
    if (shouldFetchData) {
      fetchWorkflowsList();
    }

    return () => {
      abortController.abort();
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetchData]);

  const fetchWorkflowsList = async () => {
    try {
      dispatch({
        type: "GET_DATA",
      });

      const { workflows } = await request(`/${pluginId}/workflows`, {
        method: "GET",
        signal,
      });

      dispatch({
        type: "GET_DATA_SUCCEEDED",
        data: workflows,
      });
    } catch (err) {
      const message = get(
        err,
        ["response", "payload", "message"],
        "An error occured"
      );

      if (isMounted.current) {
        dispatch({
          type: "GET_DATA_ERROR",
        });

        if (message !== "Forbidden") {
          strapi.notification.error(message);
        }
      }
    }
  };

  return { workflows, isLoading, getData: fetchWorkflowsList };
};

export default useWorkflowsList;
