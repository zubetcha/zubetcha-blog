import React, { useEffect } from 'react';
import { contactList } from '@constants/navigation';
import classes from './Resume.module.scss';

export const ResumeContainer = () => {
	useEffect(() => {
		document.documentElement.setAttribute('data-theme', 'light');
	}, []);

	return (
		<div className={classes.container}>
			<div className={classes['flex-column-16']}>
				<h1>안녕하세요, 정주혜입니다.</h1>
				<div>
					지식을 공유하고 기록하는 것을 좋아합니다. 안정적인 코드를 작성하고,
					유연하면서도 사용하기 쉬운 컴포넌트를 설계하기 위해 노력하고 있습니다.
				</div>
				<div className={classes['item-wrapper']}>
					<div className={classes['item-row']}>
						<Item
							type='Email'
							content={
								<a href={contactList.email} target='_blank'>
									zuhye5@gmail.com
								</a>
							}
						/>
						<Item
							type='Github'
							content={
								<a href={contactList.github} target='_blank'>
									{contactList.github}
								</a>
							}
						/>
					</div>
					<div className={classes['item-row']}>
						<Item
							type='Blog'
							content={
								<a href={contactList.blog} target='_blank'>
									{contactList.blog}
								</a>
							}
						/>
						<Item type='Phone' content={contactList.phone} />
					</div>
				</div>
			</div>
			<MainSection title='Work Experiences'>
				<SubSection
					content={{
						title: '젠틀에너지',
						period: '2022.03 - 현재',
						description: '스마트 팩토리 솔루션 제공',
						tech: 'Nextjs / React-query / Redux-toolkit / Typescript / Echarts / Turborepo',
					}}
				>
					<TaskSection title='디자인 시스템 구축'>
						<ul>
							<li>공통 컴포넌트 인터페이스 설계 및 개발</li>
							<li>UI 테스트를 위한 스토리북 환경 구성</li>
						</ul>
					</TaskSection>
					<TaskSection title='B2B 대시보드 솔루션'>
						<ul>
							<li>
								React v17 환경에서 react-query의 useQuery를 사용해 다수의 API
								동시 호출 시 API 개수만큼 발생하는 리렌더링을 1회로 감소시켜{' '}
								<a
									href='https://www.zubetcha.com/2022/07/rerendering-optimization-with-react-query-and-promise-all'
									target='_blank'
								>
									렌더링 최적화
								</a>
							</li>
							<li>
								Echarts 라이브러리를 사용하여 실시간 차트, 데이터 시각화 및
								대시보드 개발
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
								다국어 페이지를 개발하며 로케일별 번역본 json 스키마 추출 및
								자동 완성 객체 생성 함수를 개발하여 휴먼 에러 발생 가능성 개선
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
				</SubSection>
				<SubSection
					content={{
						title: '무인양품',
						period: '2018.03 - 2021.10',
						description: '',
					}}
				>
					<TaskSection title='생활잡화 상품 부문 MD'>
						<ul>
							<li>판매 및 수입 계획, 예산 계획 수립</li>
							<li>오프라인 채널 재고 컨트롤</li>
							<li>프로모션 상품 기획</li>
						</ul>
					</TaskSection>
				</SubSection>
			</MainSection>
			<MainSection title='Projects'>
				<SubSection
					content={{
						title: 'MeetMeet',
						period: '2022.08 - 2022.09',
						description: '사내 회의 예약 관리 서비스',
						tech: 'Nextjs / GraphQL / Recoil / Typescript',
						link: (
							<a href='https://github.com/zubetcha/MeetMeet' target='_blank'>
								https://github.com/zubetcha/MeetMeet
							</a>
						),
					}}
				>
					<TaskSection title='담당'>
						<ul>
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
							<li>이미지 HEIC 확장자 변환 및 사이즈 압축 기능 개발</li>
							<li>
								유관부서와 QA 진행 및 개선사항 적용하여 사내 백오피스 툴 도입
								완료
							</li>
							<li>
								프로젝트 리드로, 일정 관리 및 유관부서와의 커뮤니케이션 주도
							</li>
						</ul>
					</TaskSection>
				</SubSection>
				<SubSection
					content={{
						title: '블로그',
						period: '2022.09 - 현재',
						description: '파일 시스템 기반 개인 블로그',
						tech: 'Nextjs / Typescript',
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
					<TaskSection title='담당'>
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
					<TaskSection title='담당'>
						<ul>
							<li>Github Actions을 이용한 CI/CD 구축을 통해 DX 향상</li>
							<li>
								React 최적화 API 및 폰트 서브셋 제작을 통해 성능 최적화
								(Lighthouse 퍼포먼스 점수 기준 79점 → 93점 상승)
							</li>
						</ul>
					</TaskSection>
				</SubSection>
			</MainSection>
			<MainSection title='Activities'>
				<TaskSection title='스파르타 코딩클럽 온라인 부트캠프 항해99 React 매니저'>
					<ul>
						<li>
							스파르타 코딩클럽 항해99 (9기, 10기){' '}
							<Period>(2022.09 - 현재)</Period>
						</li>
						<li>
							스파르타 코딩클럽 X ICT 이노베이션 캠프 (서울, 동북){' '}
							<Period>(2022.06 - 2022.09)</Period>
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
			</MainSection>
		</div>
	);
};

interface SectionProps {
	title: string;
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
						{tech && <Item type='Teck Stack' content={tech} />}
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
