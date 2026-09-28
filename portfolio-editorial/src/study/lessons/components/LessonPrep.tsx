// 준비물 상자: 기준 버전, 실습 파일 내려받기, 완성 예시 이미지.
import type { LessonMeta } from '../types';

export function LessonPrep({ meta }: { meta: LessonMeta }) {
  return (
    <section className="block ls-prep">
      <div className="block-label">
        <span>준비물</span>
      </div>
      <p className="ls-prep-version">
        <strong>기준 버전</strong> {meta.version}
      </p>
      {(meta.startFile || meta.answerFile) && (
        <div className="ls-files">
          {meta.startFile && (
            <a className="st-btn" href={meta.startFile} download>
              시작 파일 내려받기
            </a>
          )}
          {meta.answerFile && (
            <a className="st-btn ghost" href={meta.answerFile} download>
              정답 파일 내려받기
            </a>
          )}
        </div>
      )}
      {meta.exampleImage && (
        <figure className="ls-example">
          <img src={meta.exampleImage} alt="완성 예시" loading="lazy" />
          <figcaption>이런 결과가 나오면 돼요</figcaption>
        </figure>
      )}
    </section>
  );
}
