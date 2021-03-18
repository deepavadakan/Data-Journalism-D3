# D3-Challenge

>  Build an interactive scatter plot to explore health risks facing particular demographics using D3 techniques.


## Table of contents
* [Tasks](#Tasks)
* [Analysis](#Analysis)
* [Data Sources](#data)
* [Technologies](#technologies)
* [Contact](#Contact)


## Tasks

1.  Using the D3 techniques create a scatter plot between health risks (obesity, smokes, lacks healthcare and poverty, age and household income)

2.  Each state is represented with circle elements that include state abbreviations in the circles.

3.  Add 3 risk factors to each axis which when clicked will display appropriate data.

4.  Tooltips added to circles which display the data that has been selected.

![Scatter Plot](assets/images/d3.gif)


## Analysis

### Correlations Discovered Between Health Risks and Poverty, Age, Income
#### Poverty vs Health Risks
People living in states with a higher poverty rate have higher health risks. States with a relatively higher poverty rate have more uninsured. States with a higher poverty rate also have more people in the state who smoke and a higher obesity rate. This is not surprising given the lack of access to healthcare and probably healthy and cheap food options. The outlier is Texas where the poverty rate is about average but it has the highest percentage of uninsured.

#### Age vs Health Risks
The chart shows a slight positive correlation between Age and the percentage of people who smoke. States with a lower median age have a lower percentage of smokers compared to states with a higher median age. There also appears to be a cluster of higher obesity in the 36-40 age group. Utah has the youngest median age and the lowest percentage of people who smoke. The state also has a lower obesity rate in comparison to the rest of the states. The median age of a majority of the states lies in the 36 - 40 range.

#### Household Income vs Health Risks
States with a lower median household income have more health risks. The percentage of obese people and smokers is much higher in states with lower income. This is probably due to the fact that the percentage of people with healthcare is also lower in those states.

## Technologies
* Javascript
* HTML/ CSS
* Bootstrap
* D3

## Data
[2014 ACS 1-year estimates from the US Census Bureau](assets/data/data.csv)

## Contact
Created by [@deepavadakan](https://github.com/)