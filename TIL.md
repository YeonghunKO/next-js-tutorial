# SSR(Server Side Rendering) -- default

- 데이터를 불러와서 HTML PAGE를 만들고 그에 해당하는 CSS,JS파일도 담는다. 이 모든것은 client가 아닌 server에서 한다.
  - 그래서 불러온 페이지에 모든것이 다 들어있다.(SSG도 마찬가지)
  - HTML에 SEO가 인식할 수 있는 body내용과 meta내용이 있기 때문에 검색 filtering의 상단에 위치할 가능성이 높다.
- 예전에는 SSR방식으로 웹사이트를 개발했다.
- 그래서 페이지를 불러올때마다 서버와 통신을 해야해서 깜빡이는 현상이 발생할 것이다.
  - 그래서 user interaction이 적은 페이지에 적합하다.
- 서버에 과부화가 걸릴 수 있다
  - cache-header를 쓰면 어느정도 request를 save할 수 있기는 한데 그래도 CSR보다는 많을 것이다.

# SSG

- 필요한 모든 page와 데이터를 이미 build할때 만든다.
- build할 때 만든 모든 page를 CDN에 올린다.
- runtime 때는 올린 CDN을 내려받기만 한다.
- 데이터 fetch, page rendering을 위한 server와의 통신이 필요없다.
  - 이미 배포때 다 만들어져있기 때문이다.
- 그래서 SSR과는 달리 data fetching과 page rendering하는데 시간이 걸리지 않는다. 그래서 매우빠르다.
- 그러나 말그대로 static이기 때문에 최신 데이터를 불러와서 page를 랜더링하는 할 수 없다.
  - 그러나 getStaticProps에 revalidate를 명시해줌으로서(Icreamental Static Regeneration) 새로운 데이터로 업데이트 할 수 있다
  - 참고로 getStaticProps는 build할때만 실행된다. 즉, runtime에서 실행될 수가 없다.
- static하게 html을 만들어놓고 js파일로 client쪽에서 data를 fetching 할 수 도 있다. swr(useSWR) 라이브러리를 이용하면 된다.

---- page마다 CSR, SSR, SSG를 다르게 설정할 수 있다. 그래서 POST가 많은 페이지는 SSG로 유저 인터렉션이 많은 페이지는 CSR로 HOME 페이지같은 곳은 SSR로 설정가능하다!

# next js CLI

- npx next dev -- development 모드로 들어감. 흔히 react에서 npm start라고 보면 됨
- npx next build -- production에 필요한 build파일을 만듬. 이대로 배포하면 됨
- npx next start -- production 모드로 들어감. 즉 이 모드로 들어가기 전에 build파일이 있어야 함. 실제 서비스가 이런식으로 운영이 된다는 것을 알수 있음. runtime환경

## pre-rendering되게 하는 법

```jsx
function HomePage() {
  const [loadedMeetups, setLoadedMeetups] = useState([]);
  useEffect(() => {}, [setLoadedMeetups(DUMMY)]);

  return (
    <>
      <MeetUpsList list={loadedMeetups} />
    </>
  );
}
```

- 컴포넌트가 랜더링 되고 난다음 setState를 하는 useEffect가 있다고 하자. 그럼 이 페이지는 CRA로 인식이 된다. 왜냐면 HomePage 가 첫번째 랜더링될때는 빈 [] 가 MeetUpsList로 넘어갈 것이기 때문.(snapshot of the first component rendering cycle) 두번째 랜더링 사이클에서 useEffect에 의해 list가 populated된다. 그래서 source HTML PAGE는 skeleton으로 등장하면서 SEO가 먹히지 않을 것임.

이때는 getServerSideProps/getStaticProps 함수를 사용하면 된다.

- 그리고 import 되어 넘어온 module이 위에 언급한 두개의 함수에 사용되면 client bundle.js에 포함되지 않는다. next가 smart하게 client code와 server/build code를 구분해서 bundle에 포함시킨다.
