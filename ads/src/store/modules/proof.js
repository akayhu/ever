import {
  apiGetProofSnapshot,
  apiGetProofPreview,
  apiRerenderMaterialPreview,
  apiRerenderProofSnapshot
} from "@/apis/proof";

export const MUTATIONS_TYPE = {
  UPDATE_PROOF_REPORT: "updateProofReport",
  UPDATE_PROOF_PRVIEW: "updateProofPreview",
  UPDATE_SPECIFIED_PROOF_PRVIEW: "updateSpecifiedProofPreview",
  UPDATE_SPECIFIED_PROOF_SNAPSHOT: "updateSpecifiedProofSnapshot",
  SELECT_PROOF: "selectProof",
  UNSELECT_PROOF: "unselectProof",
  SET_CURRENT_BOARD_IMAGES: "setCurrentBoardImages",
  ADD_COUNT: "addCount",
  MINUS_COUNT: "minusCount"
};

const pageState = () => {
  return {
    proofReport: [],
    proofPreview: [],
    currentBoardImages: [],
    selectedProof: "",
    renderPreviewCount: 0
  };
};

const state = {
  ...pageState()
};

const getters = {
  proofReportData: state => state.proofReport,
  proofPreviewData: state => state.proofPreview
};

const mutations = {
  [MUTATIONS_TYPE.UPDATE_PROOF_REPORT](state, payload) {
    state.proofReport = [...payload];
  },
  [MUTATIONS_TYPE.UPDATE_PROOF_PRVIEW](state, payload) {
    state.proofPreview = payload.map(item => ({
      ...item,
      materialProcessedUrlList: item.materialUrlList.map(url =>
        url ? `${url}?${new Date().getTime()}` : null
      )
    }));
  },
  [MUTATIONS_TYPE.UPDATE_SPECIFIED_PROOF_PRVIEW](
    state,
    { materialId, params }
  ) {
    const index = state.proofPreview.findIndex(
      item => item.materialId === materialId
    );

    Object.keys(params).forEach(key => {
      if (index > -1) {
        const newItem = {
          ...state.proofPreview[index],
          [key]: params[key]
        };
        state.proofPreview.splice(index, 1, newItem);
      }
    });
  },
  [MUTATIONS_TYPE.UPDATE_SPECIFIED_PROOF_SNAPSHOT](state, { id, params }) {
    const index = state.proofReport.findIndex(item => item.id === id);

    Object.keys(params).forEach(key => {
      if (index > -1) {
        const newItem = {
          ...state.proofReport[index],
          [key]: params[key]
        };
        state.proofReport.splice(index, 1, newItem);
      }
    });
  },
  [MUTATIONS_TYPE.SELECT_PROOF](state, payload) {
    if (payload) state.selectedProof = payload;
  },
  [MUTATIONS_TYPE.UNSELECT_PROOF](state) {
    state.selectedProof = "";
  },
  [MUTATIONS_TYPE.SET_CURRENT_BOARD_IMAGES](state, payload) {
    state.currentBoardImages = [...payload];
  },
  [MUTATIONS_TYPE.ADD_COUNT](state) {
    state.renderPreviewCount++;
  },
  [MUTATIONS_TYPE.MINUS_COUNT](state) {
    state.renderPreviewCount--;
  }
};

const actions = {
  // 取得樣張
  getProofSnapshot({ commit }, payload) {
    let query = `publishDate=${payload.publishDate}`;

    if (payload.customerId) query += `&customerId=${payload.customerId}`;
    if (payload.projectIdList)
      query += `&projectIdList=${payload.projectIdList}`;

    return new Promise(resolve => {
      apiGetProofSnapshot(query)
        .then(response => {
          let apiResponse = response.data.response;
          commit(MUTATIONS_TYPE.UPDATE_PROOF_REPORT, apiResponse);
          resolve(apiResponse);
        })
        .catch(error => {
          console.error("apiGetProofSnapshot", error);
          console.log("payload", payload);
        });
    });
  },

  // 取得樣張預覽
  getProofPreview({ commit }, payload) {
    return new Promise(resolve => {
      apiGetProofPreview(payload)
        .then(response => {
          let apiResponse = response.data.response;
          commit(MUTATIONS_TYPE.UPDATE_PROOF_PRVIEW, apiResponse);
          resolve(apiResponse);
        })
        .catch(error => {
          console.error("apiGetProofPreview", error);
          console.log("payload", payload);
        });
    });
  },

  // 重新產生廣告樣張
  rerenderProofPreview({ commit }, materialId) {
    return new Promise(resolve => {
      commit(MUTATIONS_TYPE.UPDATE_SPECIFIED_PROOF_PRVIEW, {
        materialId,
        params: {
          isReloading: true
        }
      });

      commit(MUTATIONS_TYPE.ADD_COUNT);

      apiRerenderMaterialPreview(materialId)
        .then(response => {
          let apiResponse = response.data.response;
          commit(MUTATIONS_TYPE.UPDATE_SPECIFIED_PROOF_PRVIEW, {
            materialId,
            params: {
              materialProcessedUrlList: apiResponse.map(url =>
                url ? `${url}?${new Date().getTime()}` : null
              )
            }
          });
          commit(MUTATIONS_TYPE.UPDATE_SPECIFIED_PROOF_PRVIEW, {
            materialId,
            params: {
              isReloading: false
            }
          });
          commit(MUTATIONS_TYPE.MINUS_COUNT);
          resolve(apiResponse);
        })
        .catch(error => {
          console.error("rerenderProofPreview", error);
          console.log("payload", materialId);
        });
    });
  },

  // 重新產生樣張截圖
  rerenderProofSnapshot({ commit }, payload) {
    return new Promise(resolve => {
      apiRerenderProofSnapshot(payload)
        .then(response => {
          commit(MUTATIONS_TYPE.UPDATE_SPECIFIED_PROOF_SNAPSHOT, {
            id: payload,
            params: {
              proof: 1
            }
          });

          let apiResponse = response.data.response;
          resolve(apiResponse);
        })
        .catch(error => {
          console.error("rerenderProofSnapshot", error);
          console.log("payload", payload);
        });
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
