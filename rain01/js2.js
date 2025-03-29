let update_time = null;

async function fetch_weather() {
  try {
    const response = await fetch("https://rmo.royalrain.go.th/api/InfoServiceApi/dailyoperationsequenceinfo");

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const json = await response.json();
    console.log("API Response:", json);

    const data = json?.data ?? [];
    if (!data.length) {
      update_weather("ไม่มีข้อมูลพยากรณ์อากาศ");
      return;
    }

    update_time = new Date();
    const forecast_html = data.map(show_weather).join("");

    update_weather(
      `${forecast_html}<p>ข้อมูลล่าสุด: ${formatDate(update_time)}</p>`
    );
  } catch (error) {
    update_weather("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    console.error("Error fetch data:", error);
  }
}

function show_weather(item) {
  let unitName;
  if (item && item.operationUnitName) {
    unitName = item.operationUnitName;
  } else {
    unitName = "ไม่ระบุ";
  }
  const operationDate = formatDate(item?.operationDate);
  let missions = [];
  if (item && item.missions) {
    missions = item.missions;
  }

  const missionList = missions
    .map(function (mission) {
      const tracksLength =
        mission.tracks && mission.tracks.length > 0 ? "มี" : "ไม่มี";
      const cloudsLength =
        mission.clouds && mission.clouds.length > 0 ? "มี" : "ไม่มี";
      return `<li>ติดตาม: ${tracksLength}, เมฆ: ${cloudsLength}</li>`;
    })
    .join("");

  return `<h2>หน่วย: ${unitName}</h2><p>วันที่: ${operationDate}</p><ul>${missionList}</ul>`;
}

function update_weather(html) {
  document.getElementById("weather-info").innerHTML = html;
}

function formatDate(dateString) {
  if (dateString) {
    return new Date(dateString).toLocaleDateString("th-TH");
  } else {
    return "ไม่ระบุวันที่";
  }
}

fetch_weather();
setInterval(fetch_weather, 300000);
