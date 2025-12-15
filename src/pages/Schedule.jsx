import React from 'react';
import './Schedule.css';

const Schedule = () => {
  return (
    <div className="schedule-container">
      <h1>무대 프로그램 편성표</h1>
      <section className="program-section">
        <img
          src="/festival_poster.jpg"
          alt="프로그램 편성표 placeholder"
          style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', marginBottom: '20px' }}
        />
        {/*
          TODO: 실제 무대 프로그램 편성표 이미지를 여기에 넣어주세요.
          예: <img src="/images/program_schedule.jpg" alt="무대 프로그램 편성표" />
          이미지는 'public' 폴더 내의 'images' 폴더에 넣는 것을 권장합니다.
        */}
      </section>
    </div>
  );
};

export default Schedule;
