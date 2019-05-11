import { useEffect, useReducer } from "react";
import { CertificateStore, uploadFile } from "./stores";
import { base642ab } from "./baseUtils";
const cerStore = new CertificateStore();

const initialState = {
  hasMore: false,
  pageSize: 10,
  page: 1,
  items: []
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "fill": {
      return {
        ...state,
        items: [...state.items, ...action.items],
        hasMore: action.hasMore,
        page: action.page,
        pageSize: action.pageSize
      };
    }
    case "remove": {
      const idx = state.items.findIndex(t => t.id === action.id);
      const items = Object.assign([], state.items);
      items.splice(idx, 1);
      return {
        ...state,
        items: items
      };
    }
    default:
      return state;
  }
};

export default () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fillCertificates(1, 4);
  }, []);

  async function fillCertificates(page, pageSize) {
    let { hasMore, items } = await cerStore.getAllCertificates(page, pageSize);
    dispatch({
      type: "fill",
      page: page,
      pageSize: pageSize,
      hasMore: hasMore,
      items: items
    });
  }

  function removeCertificate(id) {
    cerStore.removeCertificate(id);
    dispatch({
      type: "remove",
      id: id
    });
  }

  async function uploadCertificate(id) {
    let cer = await cerStore.getCertificate(id);
    uploadFile(cer.content, base642ab(cer.secret));
    dispatch({
      type: "upload",
      id: id
    });
  }

  function signCertificate(id) {
    cerStore.removeCertificate(id);
    dispatch({
      type: "sign",
      id: id
    });
  }

  return {
    state,
    removeCertificate,
    uploadCertificate,
    signCertificate,
    fillCertificates
  };
};
