document.addEventListener("DOMContentLoaded", () => {
  const applyButton = document.getElementById("apply");
  const cancelButton = document.getElementById("cancel");
  const prevMonthButton = document.getElementById("prevMonth");
  const nextMonthButton = document.getElementById("nextMonth");

  const monthName1 = document.getElementById("monthName1");
  const monthName2 = document.getElementById("monthName2");
  const monthName3 = document.getElementById("monthName3");

  const daysContainer1 = document.getElementById("days1");
  const daysContainer2 = document.getElementById("days2");
  const daysContainer3 = document.getElementById("days3");

  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  let currentDate = new Date(); // Текущая дата

  function updateMonthNames(month, year) {
      monthName1.innerText = `${monthNames[month]} ${year}`;
      monthName2.innerText = `${monthNames[(month + 1) % 12]} ${month + 1 === 12 ? year + 1 : year}`;
      monthName3.innerText = `${monthNames[(month + 2) % 12]} ${month + 2 === 12 ? year + 1 : year}`;
  }

  function fillMonthDays(container, year, month) {
    container.innerHTML = "";
    const currentMonth = new Date(year, month, 1);
    const firstDayOfMonth = (currentMonth.getDay() + 6) % 7; // Понедельник как первый день
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

    let currentDay = 1;
    let dayRow = document.createElement("tr");

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement("td");
        dayRow.appendChild(emptyCell);
    }

    while (currentDay <= lastDateOfMonth) {
        const dateCell = document.createElement("td");
        dateCell.innerText = currentDay;

        // Создание строки даты вручную, чтобы избежать смещения из-за часового пояса
        const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;
        dateCell.dataset.fullDate = fullDate; // Присваиваем дата атрибут без использования toISOString()

        dateCell.addEventListener("click", (e) => {
            const selectedDay = e.target.innerText;
            setSelectedDate(selectedDay, month, year);
        });

        dayRow.appendChild(dateCell);
        currentDay++;

        if (dayRow.children.length === 7) {
            container.appendChild(dayRow);
            dayRow = document.createElement("tr");
        }
    }

    if (dayRow.children.length > 0) {
        container.appendChild(dayRow);
    }
}

  function updateCalendar(date) {
      const month = date.getMonth();
      const year = date.getFullYear();
      updateMonthNames(month, year);
      fillMonthDays(daysContainer1, year, month);
      fillMonthDays(daysContainer2, year, month + 1);
      fillMonthDays(daysContainer3, year, month + 2);
  }

  updateCalendar(currentDate);

  function changeMonth(direction) {
      currentDate.setMonth(currentDate.getMonth() + direction);
      updateCalendar(currentDate);
  }

  prevMonthButton.addEventListener("click", () => changeMonth(-1));
  nextMonthButton.addEventListener("click", () => changeMonth(1));

  function setSelectedDate(selectedDay, month, year) {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");

    if (!startDateInput.value) {
        startDateInput.value = dateString;
        highlightSingleDate(dateString, "start-date");
    } else if (!endDateInput.value) {
        endDateInput.value = dateString;
        highlightSingleDate(dateString, "end-date");
    } else {
        // Если оба поля заполнены, при повторном выборе сбрасываем поля
        startDateInput.value = dateString;
        endDateInput.value = ''; // Сбрасываем конечную дату
        highlightSingleDate(dateString, "start-date");
        // Убираем предыдущее выделение конечной даты
        document.querySelectorAll(".end-date").forEach(el => el.classList.remove("end-date"));
    }

    handleDateChange();
}

  function handleDateChange() {
      const startDateInput = document.getElementById("startDate").value;
      const endDateInput = document.getElementById("endDate").value;

      if (startDateInput && endDateInput) {
          console.log(`Выбранный период: с ${startDateInput} по ${endDateInput}`);
          highlightDatesInRange(startDateInput, endDateInput);
      } else if (startDateInput) {
          console.log(`Выбрана начальная дата: ${startDateInput}`);
      } else if (endDateInput) {
          console.log(`Выбрана конечная дата: ${endDateInput}`);
      }
  }
  function highlightSingleDate(dateString, className) {
    const allDays = document.querySelectorAll(".month-days td");
    allDays.forEach(day => {
        const cellDate = day.dataset.fullDate;
        if (cellDate === dateString) {
            day.classList.add(className);
        } else if (className === "start-date" || className === "end-date") {
            day.classList.remove(className);  // Убираем предыдущие выделения
        }
    });
}
  function highlightDatesInRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const allDays = document.querySelectorAll(".month-days td");

    allDays.forEach(day => {
        const cellDate = new Date(day.dataset.fullDate);
        if (cellDate >= start && cellDate <= end) {
            if (!day.classList.contains("start-date") && !day.classList.contains("end-date")) {
                day.classList.add("highlight");
            }
        } else {
            day.classList.remove("highlight");
        }
    });
}

  document.getElementById('startDate').addEventListener('input', updateDateRange);
  document.getElementById('endDate').addEventListener('input', updateDateRange);

  function updateDateRange() {
      const startDate = document.getElementById('startDate').value;
      const endDate = document.getElementById('endDate').value;

      if (startDate && endDate) {
          if (new Date(startDate) <= new Date(endDate)) {
              highlightInput('startDate', true);
              highlightInput('endDate', true);
          } else {
              highlightInput('startDate', false);
              highlightInput('endDate', false);
          }
      } else if (startDate) {
          highlightInput('startDate', true);
      } else if (endDate) {
          highlightInput('endDate', true);
      }
      // Обновляем выделение дат в календаре
      highlightDatesInRange(startDate, endDate);
  }

  function highlightInput(inputId, isValid) {
      const input = document.getElementById(inputId);
      if (isValid) {
          input.style.backgroundColor = 'blue';
          input.style.color = 'white';
      } else {
          input.style.backgroundColor = 'red';
          input.style.color = 'white';
      }
  }

  applyButton.addEventListener("click", () => {
      const selectedDate = document.querySelector("td.highlight");
      if (selectedDate) {
          console.log(`Дата применена: ${selectedDate.innerText}`);
      } else {
          console.log("Не выбрана дата");
      }
  });

  cancelButton.addEventListener("click", () => {
      document.querySelectorAll("td.highlight").forEach((cell) => {
          cell.classList.remove("highlight");
          cell.style.backgroundColor = "";
          cell.style.color = "";
      });
      document.getElementById('startDate').value = '';
      document.getElementById('endDate').value = '';
      console.log("Дата отменена");
  });

    // Скрытие/отображение сайдбара
    const sidebar = document.getElementById("sidebar-menu");
    const icon = document.getElementById("icon1");
    const icon11 = document.getElementById("icon11");
  
    icon.addEventListener("click", () => {
      sidebar.style.display = "none";
      icon.style.display = "none";
      icon11.style.display = "block";
    });
  
    icon11.addEventListener("click", () => {
      sidebar.style.display = "block";
      icon.style.display = "block";
      icon11.style.display = "none";
    });
  
    // Подменю
    document.querySelectorAll(".submenu-toggle").forEach((toggle) => {
        toggle.addEventListener("click", function (event) {
          event.preventDefault();
          
          const submenu = this.nextElementSibling;
          submenu.classList.toggle("submenu-active");
      
          // Изменение изображений при клике
          const imgElements = this.querySelectorAll(".img");
          if (imgElements.length > 0) {
            imgElements.forEach((img) => {
              const newSrc = submenu.classList.contains("submenu-active") ? "./img/down.svg" : "./img/iconup.svg";
              img.setAttribute("src", newSrc);
            });
          }
        });
      });
  
    // Навигация по страницам
    const pageInput = document.getElementById("pageInput");
    const nextPage = document.getElementById("nextPage");
    const prevPage = document.getElementById("prevPage");
  
    nextPage.addEventListener("click", () => {
      let currentPage = parseInt(pageInput.value) || 1;
      if (currentPage < 5) {
        pageInput.value = currentPage + 1;
      }
    });
  
    prevPage.addEventListener("click", () => {
      let currentPage = parseInt(pageInput.value) || 1;
      if (currentPage > 1) {
        pageInput.value = currentPage - 1;
      }
    });
  });


