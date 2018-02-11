library(plyr)
library(ggplot2)
library(stringr)
library(stringi)
library(dplyr)
library(jsonlite)

# read data
df <- read.csv("data.csv", encoding="utf-8")

# some cleaning
df$sport <- gsub( " *\\(.*?\\) *", "", trimws(df$SPORT))

# get age
df$birth_date <- as.Date(df$DOB, "%m/%d/%Y")
df$age <- as.numeric((as.Date("2018-02-08") - df$birth_date) / 365.25)

# other values for vis
df$name <- paste(trimws(df$FIRST.NAME), trimws(df$LAST.NAME), sep=" ")
# check if rookie or returning olympian
df$rookie <- sapply(df$OLYMPIC.EXPERIENCE, function(x) x == '') 

# get all counts
count_all <- as.numeric(count(df))
count_rookies <- as.numeric(count(df[which(df$rookie == TRUE), ]))

highlight_count = list(
  all = count_all,
  women = as.numeric(count(df[which(df$GENDER == 'F'), ])),
  men = as.numeric(count(df[which(df$GENDER == 'M'), ])),
  rookies = count_rookies,
  experienced = count_all - count_rookies
)

# get sports data
count <- as.data.frame(table(df$sport))
avg_age <- tapply(df$age, df$sport, median)
range <- tapply(df$age, df$sport, range)
age_max <- tapply(df$age, df$sport, max)
age_min <- tapply(df$age, df$sport, min)
max_hist_value <- 0
sports <- list()
for (i in 1:length(count$Var1)) {
  selected <- subset(df, sport == count$Var1[i])
  women <- selected[which(selected$GENDER == 'F'), ]
  rookies <- selected[which(selected$rookie == TRUE), ]

  all_histogram <- hist(selected$age, breaks=seq(floor(min(selected$age)), ceiling(max(selected$age)), by=1))
  if (as.numeric(count(women)) > 0) {
    women_histogram <- hist(women$age, breaks=seq(floor(min(selected$age)), ceiling(max(selected$age)), by=1))
  }
  if (as.numeric(count(rookies)) > 0) {
    rookies_histogram <- hist(rookies$age, breaks=seq(floor(min(selected$age)), ceiling(max(selected$age)), by=1))
  }
  
  max_hist_value <- max(max_hist_value, all_histogram$counts)
  
  s <- list(
    id = i - 1,
    name = count$Var1[i],
    athletes_count = count$Freq[i],
    median_age = unname(avg_age[i]),
    age_range = unlist(unname(range[i])),
    age_diff = unname(age_max[i]) - unname(age_min[i]),
    age_hist = list (
      all = all_histogram$counts,
      women = women_histogram$counts,
      rookies = rookies_histogram$counts
    ),
    hist_start_age = all_histogram$breaks[1]
  )
  sports[i] <- list(s)
}

#create data json file
write(minify(toJSON(list(
  sports = sports, 
  highlight_count = highlight_count,
  max_age = max(df$age),
  max_hist_value = max_hist_value
), auto_unbox = TRUE)), "../react-app/src/data/data.json")