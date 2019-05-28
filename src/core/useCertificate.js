import { useEffect, useReducer } from "react";
import useCertificateStore from "./stores/useIndexedDbCertificateStore";
import useDecertStore from "./stores/useIndexedDbDecertStore";
import { base642ab, ab2hex, hex2base58 } from "./baseUtils";
import { getEncryptedContent, getRawContent } from "./cryptoUtils";

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
    case "upload": {
      const items = Object.assign([], state.items);
      return {
        ...state,
        items: items.map(item =>
          item.id === action.id ? { ...item, state: "UPLOADED" } : item
        )
      };
    }
    case "sign": {
      const items = Object.assign([], state.items);
      return {
        ...state,
        items: items.map(item =>
          item.id === action.id ? { ...item, state: "SIGNED" } : item
        )
      };
    }
    default:
      return state;
  }
};

export default () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { getAll, remove, update, create, getById } = useCertificateStore();

  const { sign, getBySecret } = useDecertStore();

  useEffect(() => {
    fillCertificates(1, 4);
  }, []);

  async function fillCertificates(page, pageSize) {
    let { hasMore, items } = await getAll(page, pageSize);
    dispatch({
      type: "fill",
      page: page,
      pageSize: pageSize,
      hasMore: hasMore,
      items: items
    });
  }

  async function removeCertificate(id) {
    await remove(id);
    dispatch({
      type: "remove",
      id: id
    });
  }

  async function signCertificate(id) {
    let cer = await getById(id);
    let encryptedContent = await getEncryptedContent(
      cer.content,
      base642ab(cer.secret)
    );
    let fileAddressAB = await crypto.subtle.digest("SHA-256", encryptedContent);
    let fileAddress = hex2base58(ab2hex(fileAddressAB));
    let createdAt = Math.floor(Date.now() / 1000);
    await sign(id, fileAddress, encryptedContent, createdAt);
    await update(id, { state: "SIGNED" });
    dispatch({
      type: "sign",
      id: id
    });
  }

  async function getCertificate(secret64) {
    let secret = base642ab(secret64);
    let idAB = await crypto.subtle.digest("SHA-256", secret);
    let id = ab2hex(idAB);
    let result = await getBySecret(id);
    let content = await getRawContent(result.content, secret);
    return Object.assign(result, { content: content });
  }

  return {
    state,
    removeCertificate,
    signCertificate,
    fillCertificates,
    getCertificate,
    createCertificate: create
  };
};
