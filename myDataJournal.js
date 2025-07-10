// CS 81 Module 4B: My Personal Data Objects, by GregH, 7/8/25
// https://github.com/Greg01001000/cs81-module4b-mydataexplorer

const weekData = [
  { day: "Monday", sleepHours: 8, screenTime: 10, mood: "fair", caffeineIntake: 0, focusLevel: 9 },
  { day: "Tuesday", sleepHours: 7, screenTime: 8, mood: "poor", caffeineIntake: 1, focusLevel: 8 },
  { day: "Wednesday", sleepHours: 6, screenTime: 12, mood: "fair", caffeineIntake: 1, focusLevel: 9 },
  { day: "Thursday", sleepHours: 7, screenTime: 7, mood: "good", caffeineIntake: 0, focusLevel: 10 },
  { day: "Friday", sleepHours: 6, screenTime: 12, mood: "excellent", caffeineIntake: 1, focusLevel: 9 },
  { day: "Saturday", sleepHours: 5, screenTime: 6, mood: "good", caffeineIntake: 0, focusLevel: 10 },
  { day: "Sunday", sleepHours: 7, screenTime: 11, mood: "excellent", caffeineIntake: 1, focusLevel: 9 }
];

// PREDICTIONS: 1. I predict that the most screentime will be on either Wednesday 
// or Friday because I usually have fewer issues requiring my attention late in
// the week, aside from a weekly Thursday meeting, and I tend to be caught up
// on sleep late in the week.
// 2. I predict that my best focus day is Sunday because I am motivated by 
// classwork deadlines.
// 3. I don't ingest much caffeine, but sometimes in the afternoon I get sleepy
// and my productivity drops. If I try to power through without caffeine, I 
// usually fall asleep while sitting up. So usually as soon as I notice that
// I'm getting sleepy, I get a cup of strong, black tea, which usually wakes me
// up and restores my productivity. So I believe my limited intake helps, even
// if it might not correlate with overall higher-focus or better-mood days in
// my made-up data. But since you asked, I'll just say, sure, I think caffeine
// is helping.


function highestDay(log, key) {
    let maxValue = Math.max(...log.map(item => item[key]));

    // Build string containing all days with highest value of parameter key
    let maxDayValue = "";
    for (let entry of log) {
        if (entry[key] == maxValue) {
            maxDayValue += entry["day"] + ": " + maxValue + "\n";
        }
    }
    return maxDayValue; 
}


const averageSleep = log => {
    let total = 0
    for (let entry of log) {
        total += entry["sleepHours"];
    }
    return total / log.length;
};


function mostFrequentMood(log) {
    // First, build an object of property-value pairs showing number of days
    // each mood occurred
    const moodCounts = {};
    for (let entry of log) {
        if (!moodCounts[entry.mood]) {
            moodCounts[entry.mood] = 1;
        } else {
            moodCounts[entry.mood]++;
        }
    }

    // Next, use that object to find the highest number of days with one mood
    let maxCount = 0;
    for (let mood in moodCounts) {
        if (moodCounts[mood] > maxCount) {
            maxCount = moodCounts[mood];
        }
    }

    // Finally, build a string containing all moods occurring the highest 
    // number of days
    let moodFreq = "";
    for (let mood in moodCounts) {
        if (moodCounts[mood] == maxCount) {
            moodFreq += mood + ": " + maxCount + "\n";
        }
    }
    return moodFreq;
}


function correlateCaffeineToFocus(log) {
    // Copy all caffeineIntake values into an array and all focusLevel values
    // into another array so we can calculate correlation on them
    const caffeine = log.map(obj => obj.caffeineIntake);
    const focus = log.map(obj => obj.focusLevel);
    const n = focus.length;

    // Calculate means
    const meanX = caffeine.reduce((sum, val) => sum + val, 0) / n;
    const meanY = focus.reduce((sum, val) => sum + val, 0) / n;

    // Calculate sums for covariance and standard deviations
    let sumXY = 0;
    let sumX2 = 0;
    let sumY2 = 0;

    for (let i = 0; i < n; i++) {
        const diffX = caffeine[i] - meanX;
        const diffY = focus[i] - meanY;
        sumXY += diffX * diffY;
        sumX2 += diffX * diffX;
        sumY2 += diffY * diffY;
    }

    // Calculate standard deviations
    const stdDevX = Math.sqrt(sumX2 / n);
    const stdDevY = Math.sqrt(sumY2 / n);

    // Handle cases where standard deviation is zero (no variability)
    if (stdDevX === 0 || stdDevY === 0) {
        return 0; // No correlation if one variable has no variability
    }

    // Calculate Pearson correlation coefficient
    const correlation = sumXY / (n * stdDevX * stdDevY);

    // Choose an interpretation of the Pearson correlation coefficient
    let msg = "";
    if (correlation > 0.5) {
        msg = "Caffeine intake is strongly correlated with high focus. Correlation value: ";
    } else if (correlation > 0.3) {
        msg = "Caffeine intake is moderately correlated with high focus. Correlation value: ";
    } else if (correlation > 0.1) {
        msg = "Caffeine intake is weakly correlated with high focus. Correlation value: ";
    } else if (correlation > -0.1) {
        msg = "Caffeine intake is not significantly correlated with focus. Correlation value: ";
    } else if (correlation > -0.3) {
        msg = "Caffeine intake is weakly correlated with low focus. Correlation value: ";
    } else if (correlation > -0.5) {
        msg = "Caffeine intake is moderately correlated with low focus. Correlation value: ";
    } else {
        msg = "Caffeine intake is strongly correlated with low focus. Correlation value: " ;      
    }
    // Return the interpretation with the correlation value rounded to two decimal places
    return msg + correlation.toFixed(2);
}


console.log("Analyzing Greg's Data Journal...\n")
console.log("Day(s) with max screen time in hours:")
console.log(highestDay(weekData, "screenTime"));
console.log("Average hours of sleep per night: " + averageSleep(weekData).toFixed(1));
console.log("\nMost frequent mood(s) with number of occurrences:")
console.log(mostFrequentMood(weekData));
console.log(correlateCaffeineToFocus(weekData));
console.log("\nDay(s) with best focus level:")
console.log(highestDay(weekData, "focusLevel"));
