# 🦠 Viral Content Spread Simulation using SIR Model

A computational simulation of viral content spread on social networks using the **SIR (Susceptible–Infected–Recovered)** epidemiological model.

## 📋 Overview

This project simulates how content (viral posts, ideas, information) spreads through a realistic social network topology. We implement both:
- **ODE-based analytical solution** - theoretical SIR dynamics
- **Agent-based network simulation** - realistic spreading on social graphs
- **Sensitivity analysis** - parameter impact assessment
- **Comprehensive visualization** - interactive plots and statistics

## 📊 Dataset

- **Type:** Barabási-Albert scale-free network
- **Inspired by:** Digg 2009 social dataset topology
- **Nodes:** 1,000 users
- **Edges:** ~2,991 connections
- **Topology:** Power-law degree distribution (realistic social network)

## 🔬 The SIR Model

The SIR model divides the population into three compartments:

$$\frac{dS}{dt} = -\beta SI$$
$$\frac{dI}{dt} = \beta SI - \gamma I$$
$$\frac{dR}{dt} = \gamma I$$

Where:
- **S** = Susceptible (can receive content)
- **I** = Infected (actively spreading content)
- **R** = Recovered (no longer spreading)
- **β** = transmission rate
- **γ** = recovery rate

## 🛠️ Technologies & Dependencies

- **Python 3.x**
- **NetworkX** - network/graph analysis
- **SciPy** - ODE solver
- **Matplotlib** - visualization
- **NumPy & Pandas** - numerical computing
- **Jupyter** - interactive notebook environment

### Installation

```bash
pip install networkx matplotlib scipy pandas numpy jupyter
```

## 📂 Project Structure

```
.
├── README.md                                    # This file
├── SIR_Viral_Spread_Simulation.ipynb           # Main notebook
└── .gitignore                                  # Git ignore rules
```

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd SIR_Viral_Spread_Simulation
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Launch Jupyter:**
   ```bash
   jupyter notebook SIR_Viral_Spread_Simulation.ipynb
   ```

4. **Run all cells** or execute step-by-step for analysis

## 📖 Notebook Sections

1. **Step 0:** Library imports and setup
2. **Step 1:** Network construction (BA model)
3. **Step 2:** SIR ODE solver implementation
4. **Step 3:** Agent-based network simulation
5. **Step 4:** Visualization and comparison
6. **Step 5:** Sensitivity analysis
7. **Step 6:** Parameter optimization
8. **Step 7:** Results and conclusions

## 🎯 Key Features

✅ Scale-free network generation  
✅ Dual-approach SIR modeling (analytical + simulation)  
✅ Parameter sensitivity analysis  
✅ Real-time visualization  
✅ Statistical summaries  
✅ Reproducible results (seed control)  

## 📈 Example Usage

```python
# Network statistics
print(f"Nodes: {G.number_of_nodes()}")
print(f"Edges: {G.number_of_edges()}")
print(f"Avg Degree: {sum(dict(G.degree()).values()) / G.number_of_nodes():.2f}")

# Run simulation
infected, recovered, susceptible = simulate_sir(G, beta=0.3, gamma=0.1, steps=100)

# Plot results
plot_sir_results(infected, recovered, susceptible)
```

## 🔍 Reference & Theory

- **SIR Model:** Kermack & McKendrick (1927)
- **Scale-free networks:** Barabási & Albert (1999)
- **Digg dataset:** Hogg & Lerman (2012)
- **Epidemic theory:** Keeling & Rohani (2008)

## 📝 License

This project is open-source and available for educational and research purposes.

## 👤 Author

Created as a mini-project for Social Network Analysis course.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Last Updated:** May 2026  
**Status:** ✅ Active & Maintained
