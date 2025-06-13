document.addEventListener('DOMContentLoaded', () => {
  // --- 1. ส่วนของการเชื่อมต่อกับ HTML Elements ---
  const startBtn = document.getElementById('start-recognition-btn');
  const resultText = document.getElementById('result-text');
  const scoreEl = document.getElementById('score');

  // --- 2. ส่วนของการตั้งค่า Web Speech API ---
  // เช็คว่าบราวเซอร์รองรับ SpeechRecognition หรือไม่
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    alert("ขออภัย บราวเซอร์ของคุณไม่รองรับฟีเจอร์นี้");
    return;
  }
  
  const recognition = new SpeechRecognition();
  recognition.lang = 'th-TH'; // ตั้งค่าให้รับเสียงเป็นภาษาไทย
  recognition.interimResults = false; // ไม่ต้องแสดงผลลัพธ์ระหว่างที่กำลังพูด

  // --- 3. ส่วนของ Event Handlers (เมื่อมีเหตุการณ์เกิดขึ้น) ---

  // เมื่อ AI ประมวลผลเสียงเสร็จและได้ผลลัพธ์
  recognition.onresult = (event) => {
    const last = event.results.length - 1;
    const spokenText = event.results[last][0].transcript.trim(); // .trim() เพื่อตัดช่องว่าง

    console.log('Confidence: ' + event.results[0][0].confidence);
    console.log('AI ได้ยินว่า:', spokenText);

    resultText.textContent = spokenText;

    // TODO: ตรวจสอบคำตอบที่นี่
    // ตัวอย่าง: checkAnswer(spokenText);
  };

  // เมื่อการรับเสียงสิ้นสุดลง
  recognition.onend = () => {
    startBtn.textContent = 'พูดเพื่อตอบ';
    startBtn.disabled = false;
  };

  // เมื่อเกิดข้อผิดพลาด
  recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    alert(`เกิดข้อผิดพลาดในการรับเสียง: ${event.error}`);
  };

  // --- 4. ส่วนของการเริ่มทำงาน ---
  
  // เมื่อคลิกปุ่ม "พูดเพื่อตอบ"
  startBtn.addEventListener('click', () => {
    try {
      recognition.start();
      startBtn.textContent = 'กำลังฟัง...';
      startBtn.disabled = true;
    } catch (error) {
      console.error("Error starting recognition:", error);
      alert("ไม่สามารถเริ่มการรับเสียงได้ อาจจะมีการเรียกซ้ำซ้อน");
    }
  });

  // ฟังก์ชันสำหรับตรวจคำตอบ (ตัวอย่าง)
  function checkAnswer(answer) {
    // คำตอบที่ถูกต้องสำหรับคำถาม "What is 2 + 2?"
    const correctAnswers = ['4', 'สี่']; 
    
    if (correctAnswers.includes(answer.toLowerCase())) {
      resultText.textContent += ' - ถูกต้อง!';
      resultText.style.color = 'lightgreen';
      
      // อัปเดตคะแนน
      let currentScore = parseInt(scoreEl.textContent);
      scoreEl.textContent = currentScore + 10;
    } else {
      resultText.textContent += ' - ยังไม่ถูก!';
      resultText.style.color = 'salmon';
    }
  }

  // เราจะเรียกใช้ฟังก์ชัน checkAnswer ภายใน onresult
  recognition.onresult = (event) => {
    const last = event.results.length - 1;
    const spokenText = event.results[last][0].transcript.trim();
    
    console.log('AI ได้ยินว่า:', spokenText);
    resultText.style.color = 'white'; // Reset สีข้อความ
    resultText.textContent = spokenText;

    checkAnswer(spokenText); // เรียกใช้ฟังก์ชันตรวจคำตอบ
  };
});