
// 1. University courses and topics
const courses = [
    {
        name: "IFT - Information Technology",
        topics: [
            "Introduction to Information Technology",
            "Computer Fundamentals",
            "Computer Networks",
            "Network Topology",
            "Data Processing",
            "Intellectual Property",
            "Utility Patent",
            "Trade Secrets"
        ]
    },
    {
        name: "MTH 101 - Mathematics",
        topics: [
            "Number Systems",
            "Sets",
            "Laws of Indices",
            "Logarithms",
            "Quadratic Equations",
            "Algebra",
            "Functions",
            "Trigonometry"
        ]
    },
    {
        name: "PHY 101 - Physics",
        topics: [
            "Measurement",
            "Scalars and Vectors",
            "Motion",
            "Force",
            "Work and Energy",
            "Simple Harmonic Motion"
        ]
    },
    {
        name: "STA 111 - Statistics",
        topics: [
            "Introduction to Statistics",
            "Data Presentation",
            "Mean",
            "Median",
            "Mode",
            "Measures of Dispersion"
        ]
    },
    {
        name: "GST 111 - English",
        topics: [
            "Grammar",
            "Parts of Speech",
            "Comprehension",
            "Essay Writing",
            "Vocabulary",
            "Communication Skills"
        ]
    }
];


// 2. Get HTML elements
const coursesContainer = document.getElementById("courses");
const topicContent = document.getElementById("topicContent");
const searchInput = document.getElementById("topicSearch");
const searchResults = document.getElementById("searchResults");
const savedTopicsContainer = document.getElementById("savedTopics");


// 3. Load saved topics
let savedTopics = JSON.parse(
    localStorage.getItem("studyMateSavedTopics") || "[]"
);


// 4. Save topics
function saveTopics() {
    localStorage.setItem(
        "studyMateSavedTopics",
        JSON.stringify(savedTopics)
    );

    displaySavedTopics();
}


// 5. Display courses
function displayCourses() {
    coursesContainer.replaceChildren();

    courses.forEach(function(course) {
        const div = document.createElement("div");
        div.className = "course";

        const heading = document.createElement("h3");
        heading.textContent = course.name;

        div.appendChild(heading);

        course.topics.forEach(function(topic) {
            const button = document.createElement("button");

            button.className = "topic-button";
            button.textContent = topic;

            button.addEventListener("click", function() {
                openTopic(course.name, topic);
            });

            div.appendChild(button);
        });

        coursesContainer.appendChild(div);
    });
}


// 6. Open learning topic
function openTopic(courseName, topic) {
    topicContent.replaceChildren();

    const heading = document.createElement("h3");
    heading.textContent = topic;

    const course = document.createElement("p");
    course.textContent = "Course: " + courseName;

    const description = document.createElement("p");
    description.textContent =
        "You are now studying " + topic +
        ". Use the learning resources below to explore this topic.";

    const searchLink = document.createElement("a");
    searchLink.href =
        "https://en.wikipedia.org/w/index.php?search=" +
        encodeURIComponent(topic);

    searchLink.target = "_blank";
    searchLink.rel = "noopener noreferrer";
    searchLink.textContent = "Find learning materials online";

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save Topic";

    saveButton.addEventListener("click", function() {
        if (!savedTopics.some(function(item) {
            return item.topic === topic &&
                item.course === courseName;
        })) {
            savedTopics.push({
                course: courseName,
                topic: topic
            });

            saveTopics();
            saveButton.textContent = "Topic Saved";
        } else {
            saveButton.textContent = "Already Saved";
        }
    });

    topicContent.appendChild(heading);
    topicContent.appendChild(course);
    topicContent.appendChild(description);
    topicContent.appendChild(searchLink);
    topicContent.appendChild(document.createElement("br"));
    topicContent.appendChild(saveButton);
}


// 7. Display saved topics
function displaySavedTopics() {
    savedTopicsContainer.replaceChildren();

    if (savedTopics.length === 0) {
        savedTopicsContainer.textContent =
            "Your saved topics will appear here.";
        return;
    }

    savedTopics.forEach(function(item, index) {
        const div = document.createElement("div");

        const name = document.createElement("p");
        name.textContent = item.course + " - " + item.topic;

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", function() {
            savedTopics.splice(index, 1);
            saveTopics();
        });

        div.appendChild(name);
        div.appendChild(removeButton);

        savedTopicsContainer.appendChild(div);
    });
}


// 8. Search courses and topics
searchInput.addEventListener("input", function() {
    const query = searchInput.value.toLowerCase().trim();

    searchResults.replaceChildren();

    if (query === "") {
        return;
    }

    courses.forEach(function(course) {
        course.topics.forEach(function(topic) {
            if (
                topic.toLowerCase().includes(query) ||
                course.name.toLowerCase().includes(query)
            ) {
                const button = document.createElement("button");

                button.textContent =
                    course.name + " - " + topic;

                button.addEventListener("click", function() {
                    openTopic(course.name, topic);
                });

                searchResults.appendChild(button);
            }
        });
    });
});


// 9. Existing Study Tasks
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

let tasks = [];

try {
    const storedTasks = JSON.parse(
        localStorage.getItem("studyMateTasks") || "[]"
    );

    if (Array.isArray(storedTasks)) {
        tasks = storedTasks.filter(function(task) {
            return task &&
                typeof task.name === "string" &&
                typeof task.completed === "boolean";
        });
    }
} catch (error) {
    tasks = [];
}


// 10. Display tasks
function displayTasks() {
    taskList.replaceChildren();

    tasks.forEach(function(task, index) {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {
            tasks[index].completed = checkbox.checked;
            saveTasks();
        });

        const span = document.createElement("span");
        span.textContent = task.name;

        if (task.completed) {
            span.classList.add("completed");
        }

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {
            tasks.splice(index, 1);
            saveTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });
}


// 11. Save tasks
function saveTasks() {
    localStorage.setItem(
        "studyMateTasks",
        JSON.stringify(tasks)
    );

    displayTasks();
}


// 12. Add task
addTaskButton.addEventListener("click", function() {
    const taskName = taskInput.value.trim();

    if (taskName === "") {
        alert("Please enter a study task!");
        return;
    }

    tasks.push({
        name: taskName,
        completed: false
    });

    taskInput.value = "";
    saveTasks();
});


// 13. Find educational videos
const videoInput = document.getElementById("videoSearch");
const videoButton = document.getElementById("searchVideos");

videoButton.addEventListener("click", function() {
    const query = videoInput.value.trim();

    if (query === "") {
        alert("Enter a topic first!");
        return;
    }

    const url =
        "https://www.youtube.com/results?search_query=" +
        encodeURIComponent(query + " educational lesson");

    window.open(url, "_blank");
});


// 14. Start StudyMate
displayCourses();
displaySavedTopics();
displayTasks();
const aiInput = document.getElementById("ai-input");
const aiSend = document.getElementById("ai-send");
const chatBox = document.getElementById("chat-box");

aiSend.addEventListener("click", async () => {
  const message = aiInput.value.trim();

  if (!message) {
    alert("Please enter a question.");
    return;
  }

  chatBox.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
  aiInput.value = "";

  const loading = document.createElement("p");
  loading.textContent = "StudyMate AI is thinking...";
  chatBox.appendChild(loading);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    loading.remove();

    const answer = document.createElement("p");
    answer.textContent = response.ok
      ? "StudyMate AI: " + data.reply
      : "Error: " + (data.error || "Unable to get an answer.");

    chatBox.appendChild(answer);

  } catch (error) {
    loading.textContent = "Connection error. Please try again.";
  }
});