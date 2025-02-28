interface project {
  name: string;
  img: string;
  menber: number;
  time: string;
  git: string;
  address: string;
  description: {
    role: string;
    tech: string;
    projectDescription: string;
    challenge: string;
    solution: string;
    feedback: string;
  };
}

export const projects: project[] = [
  {
    name: "diet-record",
    img: `${process.env.PUBLIC_URL}/image/diet-record.jpg`,
    menber: 1,
    time: "23/06/24 ~ 23/10/11",
    git: "https://github.com/leaftha/diet-record/tree/Remaster",
    address:
      "https://diet-record-0hpq-git-remaster-leafthas-projects.vercel.app/",
    description: {
      role: "프론트엔드, 간단한 백엔드 및 디자인",
      tech: "JavaScript, React, Next.js, MongoDB",
      projectDescription:
        "이 프로젝트는 다이어트 관리를 돕기 위해 제작되었습니다. 사용자는 자신의 월별 인바디를 입력하고, 그래프로 비교할 수 있으며, 하루 단위로 운동 기록을 입력해 한 달 동안 얼마나 운동했는지 달력 형태로 확인할 수 있습니다.",
      challenge:
        "초기 기획에서는 사용자의 인바디 데이터를 입력하고 비교하는 기능과, 운동 기록 기능을 구현하는 것이 가장 큰 도전이었습니다.",
      solution:
        "인바디 비교 기능은 차트로 시각화하는 방향으로 진행했으며, 혼자서 차트를 개발하기 어려워 여러 라이브러리를 검토한 후 Chart.js를 사용하여 개발했습니다. MongoDB를 이용해 사용자의 인바디 데이터를 저장하고, 특정 연도와 월 기준으로 차트를 생성하여 데이터를 비교할 수 있도록 구현했습니다. 운동 기록 기능은 달력 라이브러리를 사용해 한 달 달력을 보여주고, 각 날짜를 클릭해 그날의 운동을 입력할 수 있도록 했습니다. 저장 후 해당 날짜에는 '운동 완료' 도장이 찍히는 방식으로 처리했습니다.",
      feedback:
        "React와 Next.js를 처음 배워 이 프로젝트를 만들면서, 여러 부족한 점이 눈에 띄었지만, 처음으로 웹사이트를 제작해 본 경험이 저에게 큰 자신감을 주었습니다. 비록 완벽하진 않았지만, 혼자 힘으로 프로젝트를 완성했다는 점에서 큰 의미가 있었고, 더 성능 좋은 웹사이트를 만들기 위해 많은 노력이 필요함을 깨달았습니다.",
    },
  },

  {
    name: "reading-history",
    img: `${process.env.PUBLIC_URL}/image/reading-history.jpg`,
    menber: 5,
    time: "23/09/20 ~ 23/12/2",
    git: "https://github.com/leaftha/reading-history",
    address: "https://reading-history.vercel.app/",
    description: {
      role: "프론트엔드, 간단한 백엔드",
      tech: "JavaScript, React, Next.js, MongoDB",
      projectDescription:
        "이 프로젝트는 대학교 수업에서 팀 프로젝트로 진행되었으며, 한국의 부족한 도서량을 고려해 기획되었습니다. 사용자는 자신이 읽은 책에 대한 독후감이나 추천 내용을 공유하고, 다른 사람들이 해당 글에 댓글을 달면 서로 대댓글을 통해 의견을 주고받을 수 있는 웹사이트입니다.",
      challenge:
        "기존의 도서 독후감 사이트와 차별화하기 위해, 팀원들과 논의 끝에 책에 대해 토론하거나 느낌을 나눌 수 있는 기능을 추가하기로 했습니다. 이 기능을 통해 단순히 독후감만 작성하는 것을 넘어 사용자들 간의 소통을 증진시키려 했습니다.",
      solution:
        "책 독후감을 작성하고 저장하는 기능은 상대적으로 쉽게 개발되었습니다. 사용자가 책의 제목과 저자 정보를 입력한 후, MarkDown을 사용해 독후감을 작성하고 저장하면 MongoDB에 데이터가 저장됩니다. 하지만 사용자 간의 의견을 나눌 수 있는 토론 기능을 개발하는 데 어려움을 겪었습니다. 처음에는 실시간 웹소켓을 이용해 채팅방 형식을 고려하거나 나무위키의 토론 기능을 참고하려 했으나, Vercel에서 웹소켓 사용이 어렵다는 정보를 확인하고 대체 방안을 모색했습니다. Firebase를 통해 실시간 채팅을 구현할 수 있었지만, 당시에는 이 아이디어를 떠올리지 못해, 최종적으로는 댓글과 대댓글 기능을 구현해 사용자들이 의견을 나눌 수 있도록 했습니다. 또한 알라딘 api를 이용 추천 도서를 보여주는 기능을 추가하였습니다.",
      feedback:
        "이 프로젝트는 저에게 처음으로 팀 프로젝트를 경험하게 해주었으며, 협업의 중요성을 배울 수 있는 뜻깊은 시간이었습니다. 팀원들은 웹 개발에 익숙하지 않았지만, 프로젝트 후반부에는 함께 개발에 참여하며 많은 것을 배웠습니다. 다양한 의견을 조율하고 반영하여 결과물을 완성하는 과정에서 협력의 중요성을 다시 한번 깨달았습니다.",
    },
  },
  {
    name: "my-travel",
    img: `${process.env.PUBLIC_URL}/image/my-travel.jpg`,
    menber: 1,
    time: "24/03/23 ~ 24/07/29",
    git: "https://github.com/leaftha/my-travel",
    address: "https://my-travel-sepia.vercel.app/",
    description: {
      role: "프론트엔드, 간단한 백엔드 및 디자인",
      tech: "JavaScript, React, Next.js, MongoDB",
      projectDescription:
        "이 프로젝트는 여행을 기록하고 공유할 수 있는 웹사이트로, 사용자가 자신의 여행 계획을 작성하고 다른 사용자들에게 공개할 수 있는 기능을 제공합니다. 이를 통해 다른 사람들이 자신의 여행을 계획할 때 참고할 수 있도록 돕는 것이 목표입니다.",
      challenge:
        "여행 계획을 저장할 때 시각적으로 보여주는 것이 사용자에게 더 유용하다고 판단했습니다. 또한 여행지 검색 기능을 자동 완성으로 구현해 사용자 경험을 개선하고, 여행 중 찍은 사진을 저장하여 다른 사용자들이 참고할 수 있도록 하는 기능을 추가했습니다.",
      solution:
        "여행지 시각화는 Google Maps API를 사용하여 구현했습니다. Google Maps API는 사용자들에게 친숙하고 디자인이 깔끔해 선택하게 되었습니다. 하지만 구버전 자료가 많고, 공식 문서도 설명이 부족해 어려움을 겪었습니다. React 지식이 부족하다는 점을 깨달았고, 프로젝트 진행 중 React 공식 문서를 바탕으로 추가 학습을 시작했습니다. 이미지 저장 기능은 Firebase를 사용하여 해결했습니다. 처음에는 AWS를 고려했지만, 무료 기간이 지났고 비용 문제 및 복잡한 사용 방식 때문에 Firebase로 전환했습니다. Firebase에 이미지를 저장한 후, 해당 이미지의 URL을 MongoDB에 저장해 웹에서 표시했습니다.",
      feedback:
        "이 프로젝트는 React 지식이 얕았다는 점을 깨닫는 계기가 되었습니다. 두 개의 리액트 훅만 알고 있던 제 자신이 부끄러웠고, 프로젝트 중 여러 훅을 공부하며 적극적으로 사용해 보려 했습니다. 특히 `useReducer`와 `Context`를 도입해 부족한 부분을 채울 수 있었던 값진 경험이었습니다.",
    },
  },

  {
    name: "Local Buddy",
    img: `${process.env.PUBLIC_URL}/image/localbuddy.jpg`,
    menber: 4,
    time: "25/01/14 ~ 24/01/17",
    git: "https://github.com/leaftha/tour",
    address: "",
    description: {
      role: "프론트엔드, 디자인",
      tech: "JavaScript, React, Node.js, MongoDB",
      projectDescription:
        " 이 프로젝트는 글로벌 해커톤에서 3일간 베트남 현지 개발자들과 협업하여 개발한 웹 애플리케이션입니다. 프로젝트 내용으로는 현지의 주민을 가이드 및 친구로 사귈수 있는 사이트로 여행자가 자신이 가고 싶은 나라의 도시에 거주중인 주민중 가이드 신청한 주민에게 가이드를 부탁할 수 있는 사이트를 목표로 하였습니다.",
      challenge:
        "3일동안 만들어야 해서 최대한 필수적인 기능을 위주로 개발하였으며, 백엔드 API와의 원활한 통신을 위해 명확한 API 설계와 데이터 구조 협의를 진행했습니다.",
      solution:
        "제한 적인 개발시간에 회원가입과 로그인 기능, 해당 나라의 도시에 거주중인 가이드의 리스트를 보여주는 기능, 여행자가 가이드의 소개를 볼 수 있는 페이지, 가이드의 자기소개 작성 페이지에 중점으로 먼저 개발하였습니다. 나머지 시간은 발표를 위한 사용자 인터페이스(UI) 디자인과 스타일링 작업에 집중하였습니다.",
      feedback:
        "개발 도중 의견 차이가 발생했지만, 차분히 대화를 통해 협의점을 찾아가며 문제를 해결했습니다. 그러나 최종 발표에서 예기치 않은 사고로 인해 열심히 만든 프로토타입의 시연이 제대로 이루어지지 않았습니다. 그 순간 큰 실망감을 느꼈지만, 팀원들과 서로를 위로하고 격려하며 이를 극복할 수 있었습니다. 비록 상은 수상하지 못했지만, 이번 경험은 협업과 문제 해결 능력을 강화하고, 다양한 배경을 가진 팀원들과의 소통과 협력을 통해 시야를 넓힐 수 있는 소중한 기회였습니다.",
    },
  },
  {
    name: "Data-Structure-and-Algorithm",
    img: "",
    menber: 1,
    time: "23/03/09 ~ ",
    git: "https://github.com/leaftha/Data-Structure-and-Algorithm",
    address: "",
    description: {
      role: "알고리즘 및 코딩 테스트 공부",
      tech: "JavaScript",
      projectDescription:
        "이 프로젝트는 알고리즘과 코딩 테스트 문제를 해결하며 배운 내용을 기록하는 저장소입니다. 다양한 문제를 풀며 풀이 과정을 정리하고, 효율적인 문제 해결 방법을 학습하고 있습니다.",
      challenge:
        "현재 목표는 백준 티어에서 플래티넘에 도달하는 것이며, 이를 위해 꾸준히 문제를 해결하고 있습니다.",
      solution:
        "단계적으로 문제를 풀며, 다양한 알고리즘을 연습 중입니다. 프로그래머스에서 시작했으나 더 다양한 문제를 제공하는 백준으로 옮겨 집중적으로 공부하고 있습니다.",
      feedback:
        "이 프로젝트를 통해 자료 구조와 알고리즘에 대한 깊은 이해를 쌓을 수 있었습니다. 문제를 풀면서 처음에는 어려움을 겪었지만, 각 문제를 해결하면서 사고력이 점점 향상되었습니다. 특히, 효율적인 코드 작성과 최적화된 알고리즘 선택의 중요성을 깨달았으며, 다양한 문제 유형에 대한 경험도 많이 쌓였습니다. 하지만 아직 부족한 부분도 많이 느끼고 있으며, 특히 복잡한 문제에서 시간을 단축하는 부분에서 더 많은 연습이 필요하다고 생각합니다. 백준에서의 목표 달성을 위해 꾸준히 학습을 이어나갈 계획입니다.",
    },
  },
  {
    name: "mini-projects",
    img: "",
    menber: 1,
    time: "23/03/08 ~ ",
    git: "https://github.com/leaftha/mini-projects",
    address: "",
    description: {
      role: "프론트엔드, 간단한 백엔드 및 디자인",
      tech: "html, css, JavaScript, React, Typescript, Three.js",
      projectDescription:
        "언어를 공부하거나 새로운 라이브러리, API를 공부할때 연습용 프로젝트 모음 입니다.",
      challenge:
        "인터렉티브한 웹을 좋아하며, 새로운 기술을 배울때 직접 실습하면서 하는 것이 더 공부가 잘되는 경향이 있어 간단한 Todo앱등을 만듭니다.",
      solution:
        "Three.js, gsap, framer-motion등을 공부 하였으며, canvas를 이용한 인터렉티브한 웹또한 관심이 많아 공부 중입니다. 새로운 기술 React나 Typescript을 공부하는데 간단한 ToDo앱을 만드며 익숙해지기 위해 노력중입니다.",

      feedback:
        "이 프로젝트를 통해 새로운 기술과 라이브러리를 익히는 데 많은 도움이 되었습니다. 특히 Three.js와 gsap을 이용한 인터랙티브한 웹 구현에 대한 흥미가 커졌습니다. 프로젝트를 진행하면서 새로운 개념을 실습으로 적용해보는 과정에서 배우는 것이 훨씬 더 효과적이라는 것을 깨달았고, 이를 통해 지식을 더 깊게 탐구할 수 있었습니다. 또한, React와 TypeScript 같은 기술을 적용하면서 실전에서 어떻게 활용되는지 체득하게 되었으며, 단순한 Todo 앱부터 시작해 더 복잡한 프로젝트로 나아가는 데 자신감을 얻었습니다. 실습을 통해 기술을 다루는 능력이 향상되는 만큼, 앞으로도 지속적으로 다양한 실습 프로젝트를 진행할 계획입니다.",
    },
  },
];
