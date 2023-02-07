// 首頁 MetaInfo
const homeMetaInfo = {
  title: "104公司評論－最真實的員工評價，匿名翻轉職場生態",
  meta: [
    {
      property: "robots",
      content: "index, follow, noarchive"
    },
    {
      property: "og:title",
      content: "104公司評論－最真實的員工評價，匿名翻轉職場生態"
    },
    {
      property: "og:url",
      content: `https:${process.env.VUE_APP_DOMAIN_URL}`
    },
    {
      name: "description",
      content:
        "求職面試前先上104公司評論。看任職過的員工對公司的評價，包含：薪水福利、公司環境、工作氣氛各方面的工作心得。掌握越多公司評價，越能幫助你求職順利！你也可以匿名分享你對於公司的評價，讓大家知道公司的好與壞。"
    },
    {
      property: "og:description",
      content:
        "求職面試前先上104公司評論。看任職過的員工對公司的評價，包含：薪水福利、公司環境、工作氣氛各方面的工作心得。掌握越多公司評價，越能幫助你求職順利！你也可以匿名分享你對於公司的評價，讓大家知道公司的好與壞。"
    }
  ],
  link: [
    {
      rel: "canonical",
      href: `https:${process.env.VUE_APP_DOMAIN_URL}`
    }
  ]
};

// 匿名評論 MetaInfo
const reviewsMetaInfo = {
  title: "最新公司評論－匿名員工評論，翻轉職場生態－104公司評論",
  meta: [
    {
      property: "robots",
      content: "index, follow, noarchive"
    },
    {
      property: "og:title",
      content: "最新公司評論－匿名員工評論，翻轉職場生態－104公司評論"
    },
    {
      property: "og:url",
      content: `https:${process.env.VUE_APP_DOMAIN_URL}reviews`
    },
    {
      name: "description",
      content:
        "查看最新在職心得和公司評價內容。團結的力量，打造更友善的職場生態：104 邀請求職者匿名分享就職心得，提供公司具體的肯定和建議。藉由勞資雙方良性互動，讓在職者更滿意、求職者更安心、徵才企業找人更有利！"
    },
    {
      property: "og:description",
      content:
        "查看最新在職心得和公司評價內容。團結的力量，打造更友善的職場生態：104 邀請求職者匿名分享就職心得，提供公司具體的肯定和建議。藉由勞資雙方良性互動，讓在職者更滿意、求職者更安心、徵才企業找人更有利！"
    }
  ],
  link: [
    {
      rel: "canonical",
      href: `https:${process.env.VUE_APP_DOMAIN_URL}reviews`
    }
  ]
};

// 匿名投票 MetaInfo
const votesMetaInfo = {
  title: "最新公司投票－匿名員工評論，翻轉職場生態－104公司評論",
  meta: [
    {
      property: "robots",
      content: "index, follow, noarchive"
    },
    {
      property: "og:title",
      content: "最新公司投票－匿名員工評論，翻轉職場生態－104公司評論"
    },
    {
      property: "og:url",
      content: `https:${process.env.VUE_APP_DOMAIN_URL}votes`
    },
    {
      name: "description",
      content: `查看求職者對公司的最新發問和投票結果。104 邀請求職者匿名分享就職心得，提供公司具體的肯定和建議。藉由勞資雙方良性互動，讓在職者更滿意、求職者更安心、徵才企業找人更有利！`
    },
    {
      property: "og:description",
      content: `查看求職者對公司的最新發問和投票結果。104 邀請求職者匿名分享就職心得，提供公司具體的肯定和建議。藉由勞資雙方良性互動，讓在職者更滿意、求職者更安心、徵才企業找人更有利！`
    }
  ],
  link: [
    {
      rel: "canonical",
      href: `https:${process.env.VUE_APP_DOMAIN_URL}votes`
    }
  ]
};

// 公司專頁評論列表與投票列表 title
const getCompanyReviewVotesTitle = (companyData, routeName) => {
  const { companyName, reviewCount } = companyData;
  const companyNameText = companyName || "企業公司";

  const voteTitle = `${companyNameText}的求職者發問題目，邀請員工幫忙投票回答－104公司評論`;
  const reviewTitle = `${companyNameText}的員工評價｜面試評價｜薪水福利評比－104公司評論`;
  const noReviewTitle = `${companyNameText}的平均年薪｜員工評價｜面試評價｜加薪幅度－104公司評論`;

  if (routeName === "companyVotes") return voteTitle;
  return reviewCount ? reviewTitle : noReviewTitle;
};

// 公司專頁評論列表與投票列表 description
const getCompanyReviewVotesDescription = companyData => {
  const { companyName, reviewCount } = companyData;
  const currentYear = new Date().getFullYear();
  const companyNameText = companyName || "企業公司";

  const baseDescription = `${currentYear}年最新來自${companyNameText}員工的真實評價，應徵、面試前最想知道${companyNameText}的評論、匿名員工評價、薪水福利、工作氣氛都在104公司評論！`;
  const noReviewDescription = `${currentYear}最新來自${companyNameText}的年薪、加薪幅度等薪水福利；員工的真實評價，應徵、面試前最想知道${companyNameText}的評論、匿名員工評價、工作氣氛都在104公司評論！`;

  return reviewCount ? baseDescription : noReviewDescription;
};

// 公司專頁評論列表與投票列表 MetaInfo
const companyReviewsVotesMetaInfo = (companyData, custno, routeName) => {
  return {
    title: getCompanyReviewVotesTitle(companyData, routeName),
    meta: [
      {
        property: "robots",
        content: "index, follow, noarchive"
      },
      {
        property: "og:title",
        content: getCompanyReviewVotesTitle(companyData, routeName)
      },
      {
        property: "og:url",
        content: `https:${process.env.VUE_APP_DOMAIN_URL}company/${custno}/reviews`
      },
      {
        name: "description",
        content: getCompanyReviewVotesDescription(companyData)
      },
      {
        property: "og:description",
        content: getCompanyReviewVotesDescription(companyData)
      }
    ],
    link: [
      {
        rel: "canonical",
        href: `https:${process.env.VUE_APP_DOMAIN_URL}company/${custno}/reviews`
      }
    ]
  };
};

// 公司專頁評論詳細頁 MetaInfo
const companySingleReviewMetaInfo = (
  companyName,
  custno,
  advantageTitle,
  reviewsDetailId,
  advantageSubstring,
  isTypeInterview
) => {
  return {
    title: isTypeInterview
      ? `「${advantageTitle || "企業公司面試心得"}」－${companyName ||
          "企業公司"}的面試評價－104公司評論`
      : `「${advantageTitle || "企業公司值得鼓勵"}」－${companyName ||
          "企業公司"}的員工評論－104公司評論`,
    meta: [
      {
        property: "robots",
        content: "index, follow, noarchive"
      },
      {
        property: "og:title",
        content: isTypeInterview
          ? `「${advantageTitle || "企業公司面試心得"}」－${companyName ||
              "企業公司"}的面試評價－104公司評論`
          : `「${advantageTitle || "企業公司值得鼓勵"}」－${companyName ||
              "企業公司"}的員工評論－104公司評論`
      },
      {
        property: "og:url",
        content: `https:${process.env.VUE_APP_DOMAIN_URL}company/${custno}/reviews/${reviewsDetailId}`
      },
      {
        name: "description",
        content: isTypeInterview
          ? `${companyName ||
              "企業公司"}被面試者評價的內容：${advantageSubstring}。104 公司評論邀請面試者分享面試心得，提供公司具體的肯定和建議。`
          : `${companyName ||
              "企業公司"}被員工肯定的優點：${advantageSubstring}。104 公司評論邀請求職者匿名分享就職心得，提供公司具體的肯定和建議。`
      },
      {
        property: "og:description",
        content: isTypeInterview
          ? `${companyName ||
              "企業公司"}被面試者評價的內容：${advantageSubstring}。104 公司評論邀請面試者分享面試心得，提供公司具體的肯定和建議。`
          : `${companyName ||
              "企業公司"}被員工肯定的優點：${advantageSubstring}。104 公司評論邀請求職者匿名分享就職心得，提供公司具體的肯定和建議。`
      }
    ],
    link: [
      {
        rel: "canonical",
        href: `https:${process.env.VUE_APP_DOMAIN_URL}company/${custno}/reviews/${reviewsDetailId}`
      }
    ]
  };
};

// 公司專頁評投票細頁 MetaInfo
const companySingleVoteMetaInfo = (
  companyName,
  custno,
  title,
  votesDetailId
) => {
  return {
    title: `${title || "企業公司投票"}｜${companyName ||
      "企業公司"}投票發問－104公司評論`,
    meta: [
      {
        property: "robots",
        content: "index, follow, noarchive"
      },
      {
        property: "og:title",
        content: `${title || "企業公司投票"}｜${companyName ||
          "企業公司"}投票發問－104公司評論`
      },
      {
        property: "og:url",
        content: `https:${process.env.VUE_APP_DOMAIN_URL}company/${custno}/votes/${votesDetailId}`
      },
      {
        name: "description",
        content: `有求職者對${companyName}舉手發問，邀請員工幫忙投票回答中。104 公司評論提供「匿名投票」功能，若你找不到想看的評論，歡迎踴躍提問，讓未來同事幫你解答。`
      },
      {
        property: "og:description",
        content: `有求職者對${companyName}舉手發問，邀請員工幫忙投票回答中。104 公司評論提供「匿名投票」功能，若你找不到想看的評論，歡迎踴躍提問，讓未來同事幫你解答。`
      }
    ],
    link: [
      {
        rel: "canonical",
        href: `https:${process.env.VUE_APP_DOMAIN_URL}company/${custno}/votes/${votesDetailId}`
      }
    ]
  };
};

// 搜尋公司 MetaInfo
const searchMetaInfo = keyword => {
  return {
    title: `${`${keyword}的相關公司名稱查詢` || "公司名稱查詢"}－104公司評論`,
    meta: [
      {
        property: "robots",
        content: "index, follow, noarchive"
      },
      {
        property: "og:url",
        content: `https:${process.env.VUE_APP_DOMAIN_URL}search`
      },
      {
        property: "og:title",
        content: `${keyword || "公司名稱查詢"}－104公司評論`
      },
      {
        name: "description",
        content:
          "團結的力量，打造更友善的職場生態：104 邀請求職者匿名分享就職心得，提供公司具體的肯定和建議。藉由勞資雙方良性互動，讓在職者更滿意、求職者更安心、徵才企業找人更有利！"
      },
      {
        property: "og:description",
        content:
          "團結的力量，打造更友善的職場生態：104 邀請求職者匿名分享就職心得，提供公司具體的肯定和建議。藉由勞資雙方良性互動，讓在職者更滿意、求職者更安心、徵才企業找人更有利！"
      }
    ],
    link: [
      {
        rel: "canonical",
        href: `https:${process.env.VUE_APP_DOMAIN_URL}search`
      }
    ]
  };
};

// 搜尋公司低於4分 MetaInfo
const serachPrivateMetaInfo = keyword => {
  return {
    title: `${keyword || "公司名稱查詢"}－104公司評論`,
    meta: [
      {
        property: "robots",
        content: "noindex, nofollow"
      },
      {
        property: "og:url",
        content: `https:${process.env.VUE_APP_DOMAIN_URL}search`
      },
      {
        property: "og:title",
        content: `${keyword || "公司名稱查詢"}－104公司評論`
      },
      {
        name: "description",
        content:
          "團結的力量，打造更友善的職場生態：104 邀請求職者匿名分享就職心得，提供公司具體的肯定和建議。藉由勞資雙方良性互動，讓在職者更滿意、求職者更安心、徵才企業找人更有利！"
      },
      {
        property: "og:description",
        content:
          "團結的力量，打造更友善的職場生態：104 邀請求職者匿名分享就職心得，提供公司具體的肯定和建議。藉由勞資雙方良性互動，讓在職者更滿意、求職者更安心、徵才企業找人更有利！"
      }
    ],
    link: [
      {
        rel: "canonical",
        href: `https:${process.env.VUE_APP_DOMAIN_URL}search`
      }
    ]
  };
};

// 匿名評論
const formReviewMetaInfo = {
  title: "匿名評論－104公司評論",
  meta: [
    {
      property: "robots",
      content: "noindex, nofollow"
    }
  ]
};

// 發起投票
const formVoteMetaInfo = {
  title: "發起投票－104公司評論",
  meta: [
    {
      property: "robots",
      content: "noindex, nofollow"
    }
  ]
};

// 投票已送出
const formVoteDoneMetaInfo = {
  title: "投票已送出－104公司評論",
  meta: [
    {
      property: "robots",
      content: "noindex, nofollow"
    }
  ]
};

// 評論已送出
const formReviewDoneMetaInfo = {
  title: "評論已送出－104公司評論",
  meta: [
    {
      property: "robots",
      content: "noindex, nofollow"
    }
  ]
};

const leaderboardMetaInfo = rankingType => {
  if (!rankingType) return;
  const seoMap = {
    salary: {
      title: "最新薪水排行－上市上櫃薪資排名－104公司評論",
      desc:
        "查看最新上市上櫃公司薪水排行榜。掌握企業薪資資訊，讓求職談薪更有利。藉由勞資雙方良性互動，讓在職者更滿意、求職者更安心、徵才企業找人更有利！"
    },
    company: {
      title: "公司整體排名－104會員評價最好的公司－104公司評論",
      desc:
        "查看最新的公司排行榜，由104百萬會員評價的最佳公司，掌握企業資訊。藉由勞資雙方良性互動，讓在職者更滿意、求職者更安心、徵才企業找人更有利！"
    },
    workplace: {
      title: "公司環境排名－104會員評價最好的公司－104公司評論",
      desc:
        "查看最新的公司環境排行榜，由104百萬會員評價的最佳公司，掌握企業資訊。藉由勞資雙方良性互動，讓在職者更滿意、求職者更安心、徵才企業找人更有利！"
    },
    feeling: {
      title: "公司氣氛排名－104會員評價最好的公司－104公司評論",
      desc:
        "查看最新的公司氣氛排行榜，由104百萬會員評價的最佳公司，掌握企業資訊。藉由勞資雙方良性互動，讓在職者更滿意、求職者更安心、徵才企業找人更有利！"
    },
    career: {
      title: "公司未來排名－104會員評價最好的公司－104公司評論",
      desc:
        "查看最新的公司未來排行榜，由104百萬會員評價的最佳公司，掌握企業資訊。藉由勞資雙方良性互動，讓在職者更滿意、求職者更安心、徵才企業找人更有利！"
    },
    balance: {
      title: "公司穩定度排名－104會員評價最好的公司－104公司評論",
      desc:
        "查看最新的公司穩定度排行榜，由104百萬會員評價的最佳公司，掌握企業資訊。藉由勞資雙方良性互動，讓在職者更滿意、求職者更安心、徵才企業找人更有利！"
    }
  };
  const seoData = seoMap[rankingType];
  return {
    title: seoData.title,
    meta: [
      {
        property: "robots",
        content: "index, follow, noarchive"
      },
      {
        property: "og:title",
        content: seoData.title
      },
      {
        property: "og:url",
        content: `https:${process.env.VUE_APP_DOMAIN_URL}top/${rankingType}`
      },
      {
        name: "description",
        content: seoData.desc
      },
      {
        property: "og:description",
        content: seoData.desc
      }
    ],
    link: [
      {
        rel: "canonical",
        href: `https:${process.env.VUE_APP_DOMAIN_URL}top/${rankingType}`
      }
    ]
  };
};

// 比較公司 MetaInfo
const compareCompanyMetaInfo = {
  title: "公司比一比－比較好公司－104公司評論",
  meta: [
    {
      property: "robots",
      content: "index, follow, noarchive"
    },
    {
      property: "og:title",
      content: "公司比一比－比較好公司－104公司評論"
    },
    {
      property: "og:url",
      content: `https:${process.env.VUE_APP_DOMAIN_URL}top/compare`
    },
    {
      name: "description",
      content:
        "挑出想比的公司，比較出好公司，查看公司的各項評價、薪水資訊。掌握企業薪資資訊，讓求職、談薪更有利。藉由勞資雙方良性互動，讓在職者更滿意、求職者更安心、徵才企業找人更有利！"
    },
    {
      property: "og:description",
      content:
        "挑出想比的公司，比較出好公司，查看公司的各項評價、薪水資訊。掌握企業薪資資訊，讓求職、談薪更有利。藉由勞資雙方良性互動，讓在職者更滿意、求職者更安心、徵才企業找人更有利！"
    }
  ],
  link: [
    {
      rel: "canonical",
      href: `https:${process.env.VUE_APP_DOMAIN_URL}top/compare`
    }
  ]
};

// 404 MetaInfo
const page404MetaInfo = {
  title: "QQ… 找不到任何頁面",
  meta: [
    {
      property: "robots",
      content: "noindex, nofollow"
    }
  ]
};

// 500 MetaInfo
const page500MetaInfo = {
  title: "QQ… 網頁暫時壞掉了～",
  meta: [
    {
      property: "robots",
      content: "noindex, nofollow"
    }
  ]
};

// 關於我們 MetaInfo
const aboutMetaInfo = {
  title: "關於我們－104公司評論",
  meta: [
    {
      property: "robots",
      content: "index, follow, noarchive"
    }
  ]
};

// 常見問答 MetaInfo
const questionsMetaInfo = {
  title: "常見問答－104公司評論",
  meta: [
    {
      property: "robots",
      content: "index, follow, noarchive"
    }
  ]
};

// 封站頁 MetaInfo
const sealingStationMetaInfo = {
  title: "QQ… 網站功能維護中～",
  meta: [
    {
      property: "robots",
      content: "index, follow, noarchive"
    }
  ]
};

// 服務條款 MetaInfo
const termsMetaInfo = {
  title: "服務條款－104公司評論",
  meta: [
    {
      property: "robots",
      content: "index, follow, noarchive"
    }
  ]
};

export {
  homeMetaInfo,
  reviewsMetaInfo,
  votesMetaInfo,
  companyReviewsVotesMetaInfo,
  companySingleReviewMetaInfo,
  companySingleVoteMetaInfo,
  page404MetaInfo,
  page500MetaInfo,
  aboutMetaInfo,
  questionsMetaInfo,
  sealingStationMetaInfo,
  termsMetaInfo,
  searchMetaInfo,
  serachPrivateMetaInfo,
  formVoteDoneMetaInfo,
  formReviewDoneMetaInfo,
  formReviewMetaInfo,
  formVoteMetaInfo,
  compareCompanyMetaInfo,
  leaderboardMetaInfo
};
