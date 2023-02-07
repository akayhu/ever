import { encodeCustno } from "@/utils/index";

// 首頁 jsonLd
const homeJsonLd = [
  {
    "@context": "http://schema.org/",
    "@type": "WebSite",
    url: `https:${process.env.VUE_APP_DOMAIN_URL}`,
    name: "104公司評論"
  },
  {
    "@context": "http://schema.org/",
    "@type": "Organization",
    name: "104人力銀行",
    url: `https:${process.env.VUE_APP_104_URL}`,
    logo: `https:${process.env.VUE_APP_STATIC_URL}logo/104logo_200x200.png`
  }
];

// 公司專頁 jsonLd
const companyReviewsVotesJsonLd = (companyData, custno, scoreOverall) => {
  const baseJsonLd = {
    "@context": "http://schema.org/",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: "1",
        name: "公司評論",
        item: `https:${process.env.VUE_APP_DOMAIN_URL}`
      },
      {
        "@type": "ListItem",
        position: "2",
        name: `${companyData.companyName}`,
        item: `https:${process.env.VUE_APP_DOMAIN_URL}company/${custno}/reviews`
      }
    ]
  };

  const moreDetailJsonLd = {
    "@context": "http://schema.org/",
    "@type": "EmployerAggregateRating",
    ratingValue: `${scoreOverall}`,
    reviewCount: `${companyData.reviewCount}`,
    bestRating: "5",
    worstRating: "1",
    itemReviewed: {
      "@type": "Organization",
      name: `${companyData.companyName}`,
      legalName: `${companyData.companyName}`,
      url: `https:${process.env.VUE_APP_DOMAIN_URL}company/${custno}/reviews`
    }
  };

  return companyData.reviewCount
    ? [baseJsonLd, moreDetailJsonLd]
    : [baseJsonLd];
};

// 公司單則評論內頁 jsonLd
const companySingleReviewJsonLd = (
  companyData,
  custno,
  id,
  plantId,
  createDate
) => {
  return [
    {
      "@context": "http://schema.org/",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: "1",
          name: "公司評論",
          item: `https:${process.env.VUE_APP_DOMAIN_URL}`
        },
        {
          "@type": "ListItem",
          position: "2",
          name: `${companyData.companyName}`,
          item: `https:${process.env.VUE_APP_DOMAIN_URL}company/${custno}/reviews`
        },
        {
          "@type": "ListItem",
          position: "3",
          name: "匿名評論",
          item: `https:${process.env.VUE_APP_DOMAIN_URL}company/${custno}/reviews/${id}`
        }
      ]
    },
    {
      "@context": "http://schema.org/",
      "@type": "Review",
      itemReviewed: {
        "@type": "Organization",
        name: `${companyData.companyName}`
      },
      author: {
        "@type": "Person",
        name: plantId
      },
      datePublished: createDate,
      reviewRating: {
        "@type": "Rating",
        ratingValue: `${companyData.scoreOverall}`,
        bestRating: "5",
        worstRating: "1"
      }
    }
  ];
};

// 公司單則投票內頁 jsonLd
const companySingleVoteJsonLd = (
  companyName,
  custno,
  votesDetail,
  createDate,
  plantId,
  getVotesItem
) => {
  return [
    {
      "@context": "http://schema.org/",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: "1",
          name: "公司評論",
          item: `https:${process.env.VUE_APP_DOMAIN_URL}`
        },
        {
          "@type": "ListItem",
          position: "2",
          name: companyName,
          item: `https:${process.env.VUE_APP_DOMAIN_URL}company/${custno}/reviews`
        },
        {
          "@type": "ListItem",
          position: "3",
          name: "匿名投票",
          item: `https:${process.env.VUE_APP_DOMAIN_URL}company/${custno}/votes/${votesDetail.id}`
        }
      ]
    },
    {
      "@context": "http://schema.org/",
      "@type": "QAPage",
      mainEntity: {
        "@type": "Question",
        name: votesDetail.title,
        text: `求職者對${companyName}舉手發問，邀請員工幫忙解答！`,
        dateCreated: createDate,
        answerCount: votesDetail.voteItems ? votesDetail.voteItems.length : 0,
        upvoteCount: votesDetail.count,
        author: {
          "@type": "Person",
          name: plantId
        },
        suggestedAnswer: getVotesItem
      }
    }
  ];
};

const leaderboardJsonLd = rankingData => {
  const header = {
    "@context": "http://schema.org",
    "@type": "ItemList"
  };
  const itemListElement = rankingData.map((company, idx) => {
    return {
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Thing",
        name: company.custName,
        url: `https:${process.env.VUE_APP_DOMAIN_URL}company/${encodeCustno(
          company.custno
        )}/reviews`,
        image: company.logoUrl,
        description: company.popularComment
      }
    };
  });
  return Object.assign(header, { itemListElement });
};

export {
  homeJsonLd,
  companyReviewsVotesJsonLd,
  companySingleReviewJsonLd,
  companySingleVoteJsonLd,
  leaderboardJsonLd
};
