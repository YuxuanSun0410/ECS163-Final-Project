# Why Do Employees Leave Their Jobs?
## Exploring the Factors Behind Employee Attrition

### ECS 163 Final Project

## Project Description

Employee attrition is a costly and complex issue that affects organizations across industries. While leaving a job is often viewed as a single decision, attrition is typically the result of multiple workplace factors accumulating over time. This project explores the factors that contribute to employees voluntarily leaving their jobs and visualizes how workplace conditions influence attrition outcomes.

Using an employee attrition dataset, we developed a interactive visualization that allows users to explore patterns associated with employee turnover. The project combines multiple visualization techniques to highlight relationships between job role, income level, overtime status, job satisfaction, and attrition outcomes.

The visualization follows a narrative storytelling approach, guiding users through key drivers of employee attrition before allowing them to freely explore the data. By combining explanatory and exploratory visualizations, the project aims to help users better understand why employees choose to leave their jobs and how multiple workplace pressures can interact to influence attrition.

### Visualizations Included

#### Bar Chart
- Displays attrition rates across different job roles.
- Allows users to compare turnover patterns among employee positions.

#### Sankey Diagram
- Visualizes pathways leading to employee attrition.
- Connects job role, income level, overtime status, job satisfaction, and attrition outcomes.
- Highlights how multiple workplace factors contribute to employee turnover.

#### Scatter Plot
- Displays the relationship between monthly income and job satisfaction.
- Highlights differences between employees who stayed and employees who left.

---

## Repository Structure

```text
ECS163-Final-Project/
├── data/
│   └── employee_attrition.csv
│
├── src/
│   ├── main.js
│   ├── barChart.js
│   ├── sankey.js
│   └── scatterPlot.js
│
├── index.html
├── style.css
└── README.md
```

### File Descriptions

| File | Description |
|--------|-------------|
| `index.html` | Main webpage that loads all visualizations |
| `style.css` | Styling and layout for the visualization dashboard |
| `src/main.js` | Loads the dataset and initializes all visualizations |
| `src/barChart.js` | Creates the attrition by job role bar chart |
| `src/sankey.js` | Creates the employee attrition Sankey diagram |
| `src/scatterPlot.js` | Creates the income vs. job satisfaction scatter plot |
| `data/employee_attrition.csv` | Dataset used throughout the project |

---

## Installation

### Prerequisites

To run this project, install the following:

- Python 3.x
- A modern web browser 

### Clone the Repository

```bash
git clone https://github.com/YuxuanSun0410/ECS163-Final-Project.git
cd ECS163-Final-Project
```

### Dataset Setup

The required dataset is already included in the repository:

```text
data/employee_attrition.csv
```

No additional downloads, preprocessing, or installation steps are required.

---

## Execution

### 1: Navigate to the Project Directory

```bash
cd ECS163-Final-Project
```

### 2: Start a Local Web Server

Because modern browsers restrict loading local CSV files directly, a local web server must be used.

Run:

```bash
python -m http.server 8000
```

### 3: Open the Project

Open a web browser and navigate to:

```text
http://localhost:8000
```

### 4: Explore the Visualizations

The webpage will automatically load:

1. Employee Attrition by Job Role Bar Chart
2. Employee Attrition Sankey Diagram
3. Monthly Income vs. Job Satisfaction Scatter Plot

Users can interact with the visualizations to explore factors associated with employee turnover.

---

## Reproducibility

This project is fully reproducible using the files provided in this repository.

To reproduce our results:

1. Clone or download the repository from GitHub.
2. Verify that `employee_attrition.csv` is located in the `data` directory.
3. Start a local web server:

```bash
python -m http.server 8000
```

4. Open:

```text
http://localhost:8000
```

5. The dataset will be loaded automatically using D3.js.
6. All visualizations will be generated dynamically from the provided data.

No manual preprocessing, data cleaning, or additional setup is required.

---

## Languages Used

- HTML5
- CSS3
- JavaScript
- D3.js (v7)
- D3 Sankey

---

## Members

- Yuxuan Sun
- Ann Le
- Malvina Singh
- Diego Beltran
- Anya Kumar

**ECS 163 Final Project**  
