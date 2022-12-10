import { useEffect } from 'react';
import { CONTACT_LIST } from '@constants/navigation';
import classes from './resume-page.module.scss';

export const ResumePage = () => {
	useEffect(() => {
		document.documentElement.setAttribute('data-theme', 'light');
	}, []);

	return (
		<div className={classes.container}>
			<div className={classes['flex-column-16']}>
				<h1>안녕하세요, 정주혜입니다.</h1>
				<div style={{ lineHeight: '1.4' }}>
					지식을 공유하고 기록하는 것을 좋아하며, 유연하면서도 사용하기 쉬운
					컴포넌트를 설계하는 일과 DX에 관심이 많은 프론트엔드 개발자입니다.
					<br />
					가벼운 배려와 유머, 친절함 그리고 용기를 중요한 덕목으로 여깁니다.
					<br />
					주로 Nextjs, React-query, Recoil을 사용하며 개발하고 있습니다.
				</div>
				<div className={classes['item-wrapper']}>
					<div className={classes['item-row']}>
						<Item
							type='Email'
							content={
								<a href={CONTACT_LIST.email} target='_blank'>
									zuhye5@gmail.com
								</a>
							}
						/>
						<Item
							type='Github'
							content={
								<a href={CONTACT_LIST.github} target='_blank'>
									{CONTACT_LIST.github}
								</a>
							}
						/>
					</div>
					<div className={classes['item-row']}>
						<Item
							type='Blog'
							content={
								<a href={CONTACT_LIST.blog} target='_blank'>
									{CONTACT_LIST.blog}
								</a>
							}
						/>
						<Item type='Phone' content={CONTACT_LIST.phone} />
					</div>
				</div>
			</div>
			<MainSection title='Work Experiences'>
				<SubSection
					content={{
						title: '젠틀에너지',
						period: '2022.03 - 현재',
						description:
							'디자인 시스템 / 웹 솔루션 / 모노레포 / 어드민 / 백오피스',
						tech: 'Nextjs / React-query / Redux-toolkit / GraphQL / Recoil / Typescript / SCSS / Echarts / Turborepo / Storybook',
					}}
				>
					<TaskSection title='디자인 시스템 개발'>
						<ul>
							<li>
								의존도를 없애고 자유로운 커스터마이징을 위해 외부 라이브러리
								없이 0부터 개발
							</li>
							<li>
								네이밍과 유연함에 중점을 둔 공통 컴포넌트 인터페이스 설계 및
								개발
							</li>
							<li>UI 테스트를 위한 Storybook 프로젝트 구성</li>
							<li>
								인터페이스 설계 과정 및 고민했던 점들을 문서화하여 팀내 공유
							</li>
						</ul>
					</TaskSection>
					<TaskSection title='Factoroid 솔루션'>
						<ul>
							<li>
								react-query의 useQuery로 다수의 API 동시 호출 시 API 개수만큼
								발생하는 리렌더링을 1회로 감소시켜{' '}
								<a
									href='https://www.zubetcha.com/2022/07/rerendering-optimization-with-react-query-and-promise-all'
									target='_blank'
								>
									렌더링 최적화
								</a>
							</li>
							<li>
								polling 방식을 이용한 실시간 차트, 데이터 시각화 및 대시보드
								개발
							</li>
							<li>
								Echarts 라이브러리의 트리쉐이킹 적용을 통해{' '}
								<a
									href='https://www.zubetcha.com/2022/08/bundle-optimization-with-tree-shaking'
									target='_blank'
								>
									번들 사이즈 최적화
								</a>{' '}
								(약 46% 감소)
							</li>
							<li>
								다국어 지원 기능을 개발하기 위해 사용한 next-i18next
								라이브러리에서 휴먼 에러가 발생할 수 있는 가능성을 개선하기 위해
								자동 완성되는 오브젝트 리터럴 생성 유틸함수 개발
							</li>
						</ul>
					</TaskSection>
					<TaskSection title='Turborepo 기반 모노레포 구축'>
						<ul>
							<li>
								<a
									href='https://www.zubetcha.com/2022/11/monorepo-with-turborepo'
									target='_blank'
								>
									공통 config 패키지화
								</a>
								를 통해 프로젝트 세팅 리소스 감소
							</li>
							<li>
								관심사 분리, 관리 포인트 최소화 및 빌드 시간 단축을 통해 DX 향상
							</li>
						</ul>
					</TaskSection>
					<TaskSection title='어드민 페이지 개발'>
						<ul>
							<li>
								계정, 고객사의 공장, 설비 및 부착된 센서를 관리하는 MES 및 ERP
								서비스
							</li>
							<li>
								Google Map의 지도, 마커, 팝업 등의 UI 요소 인스턴스 생성 로직,
								옵션 설정 로직 및 지도 컴포넌트를 분리하여 재사용성 향상
							</li>
							<li>
								DX 향상을 위해 MSW 라이브러리 도입을 주도하여 API 개발 전후
								기준으로 수정해야 하는 코드량 감소
							</li>
						</ul>
					</TaskSection>
					<TaskSection title='사내 회의 예약 관리 백오피스 서비스 개발'>
						<ul>
							<li>
								엑셀 시트로 회의를 예약해야 하는 불편함을 해소하고자 자발적으로
								자체 기획 및 디자인하여 개발
							</li>
							<li>
								PWA 적용 및 Firebase Cloud Messaging 서비스를 이용하여{' '}
								<a
									href='https://www.zubetcha.com/2022/10/web-push-alarm-with-firebase-cloud-messaging'
									target='_blank'
								>
									웹 푸시 알림 개발
								</a>
							</li>
							<li>SSE 방식을 이용하여 실시간 알림 메시지 수신 기능 개발</li>
							<li>
								이미지 HEIC 확장자 변환 기능을 개발하여 크로스 플랫폼 지원
							</li>
							<li>
								유관부서와 QA 진행 및 개선사항 적용하여 사내 백오피스 툴 도입
								완료
							</li>
							<li>
								프로젝트 리드를 담당하여 일정 관리 및 유관부서와의 커뮤니케이션
								주도
							</li>
						</ul>
					</TaskSection>
				</SubSection>
			</MainSection>
			<MainSection title='Projects'>
				<SubSection
					content={{
						title: '블로그',
						period: '2022.09 - 현재',
						description: '파일 시스템 기반 개인 블로그',
						tech: 'Nextjs / Typescript / SCSS',
						link: (
							<a
								href='https://github.com/zubetcha/zubetcha-blog'
								target='_blank'
							>
								https://github.com/zubetcha/zubetcha-blog
							</a>
						),
					}}
				>
					<TaskSection title='SEO 최적화'>
						<ul>
							<li>
								getStaticPaths와 getStaticProps를 사용하여 포스트 개수에 따라
								접근할 수 있는 페이지 제한
							</li>
							<li>JSON-LD를 사용한 스키마 마크업 구성을 통해 SEO 최적화</li>
						</ul>
					</TaskSection>
				</SubSection>
				<SubSection
					content={{
						title: '밈글밈글',
						period: '2021.12 - 2021.01',
						description:
							'신조어와 최신 밈을 즐길 수 있는 신조어 오픈 사전 및 커뮤니티 서비스',
						tech: 'React / Redux / Styled-components',
						link: (
							<a
								href='https://github.com/zubetcha/MemegleMemegle'
								target='_blank'
							>
								https://github.com/zubetcha/MemegleMemegle
							</a>
						),
					}}
				>
					<TaskSection title='CI/CD 및 최적화'>
						<ul>
							<li>Github Actions을 이용한 CI/CD 구축을 통해 DX 향상</li>
							<li>
								React 최적화 API 및 폰트 서브셋 제작을 통해 성능 최적화
								(Lighthouse 퍼포먼스 점수 기준 79점 → 93점)
							</li>
						</ul>
					</TaskSection>
				</SubSection>
			</MainSection>
			<MainSection title='Activities'>
				<TaskSection title='스파르타 코딩클럽 항해99 React 튜터'>
					<ul>
						<li>
							스파르타 코딩클럽 항해99 (9기, 10기){' '}
							<Period>(2022.09 - 현재)</Period>
						</li>
						<li>
							스파르타 코딩클럽 X ICT 이노베이션 캠프 (서울, 동북){' '}
							<Period>(2022.06 - 2022.09)</Period>
						</li>
						<li>
							수강생 대상으로 라이브 세션 진행
							<ul>
								<li>
									<a
										href='https://us02web.zoom.us/rec/play/RO27wvBzh_3njYvdrvEECQPdDncUthgM4PPM4IJDo_ZoKAi7qtsCk0MoWM20Ctn4auE9GvYdH0P0rR2n.CxBLyMkWKfhrplGE?continueMode=true&_x_zm_rtaid=MOHddul_RKyuoF6GsP6fDg.1669773385172.f2bb08e41dae60e3395f0c4fa9e97c16&_x_zm_rhtaid=977'
										target='_blank'
									>
										React와 Virtual DOM
									</a>
									<Period> (2022.11)</Period>
								</li>
							</ul>
						</li>
					</ul>
				</TaskSection>
			</MainSection>
			<MainSection title='Others'>
				<TaskSection title='외국어'>
					<ul>
						<li>영어: TOEIC 950점 / TOEIC Speaking level 6</li>
						<li>일본어: JLPT N1</li>
					</ul>
				</TaskSection>
				<TaskSection title='교육'>
					<ul>
						<li>
							스파르타 코딩클럽 항해99 4기 수료{' '}
							<Period>(2021.11 - 2022.02)</Period>
						</li>
						<li>
							경영학 전공 <Period>(2013.03 - 2018.02)</Period>
						</li>
					</ul>
				</TaskSection>
				<TaskSection title='개발 외 업무 경험'>
					<ul>
						<li>
							무인양품 상품팀 생활잡화 파트 MD (대리){' '}
							<Period>(2018.03 - 2021.10)</Period>
						</li>
					</ul>
				</TaskSection>
			</MainSection>
		</div>
	);
};

export default ResumePage;

interface SectionProps {
	title: string;
	children: React.ReactNode;
}

interface SubSectionProps {
	content: {
		title: string;
		period: string;
		description: string;
		tech?: string;
		link?: React.ReactNode;
	};
	children: React.ReactNode;
}

const MainSection = ({ title, children }: SectionProps) => {
	return (
		<div className={classes['flex-column-24']}>
			<h2>{title}</h2>
			{children}
		</div>
	);
};

const SubSection = ({ content, children }: SubSectionProps) => {
	const { title, period, description, tech, link } = content;
	return (
		<div className={classes['flex-column-24']}>
			<div className={classes['flex-column-16']}>
				<div className={classes['title-wrapper']}>
					<h3>{title}</h3>
					<Period>{period}</Period>
				</div>
				{description && (
					<div className={classes['item-wrapper']}>
						{link && <Item type='Github' content={link} />}
						{tech && <Item type='Tech Stack' content={tech} />}
						<Item type='Description' content={description} />
					</div>
				)}
			</div>
			<div className={classes['flex-column-24']}>{children}</div>
		</div>
	);
};

interface TaskSectionProps {
	title: React.ReactNode;
	children: React.ReactNode;
}

const TaskSection = ({ title, children }: TaskSectionProps) => {
	return (
		<div className={classes['flex-column-8']}>
			<div>
				<h4>{title}</h4>
				<div className={classes.border}></div>
			</div>
			{children}
		</div>
	);
};

const Item = ({
	type,
	content,
}: {
	type: string;
	content: React.ReactNode;
}) => {
	return (
		<div className={classes.item}>
			<p className={classes['item-type']}>{type}</p>
			<p className={classes['item-contant']}>{content}</p>
		</div>
	);
};

const Period = ({ children }: { children: React.ReactNode }) => {
	return <span className={classes.period}>{children}</span>;
};
