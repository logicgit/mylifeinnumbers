// Measurement Units
var time = 
{
    steps: new Array("milliseconds", "seconds", "minutes", "hours", "days", "years"), 
    stepsCalc: new Array(1, 1000, 60, 60, 24, 365.242199)
}
var length = 
{
    steps: new Array("nanometres", "micron", "millimetres", "centimetres", "metres", "kilometres"), 
    stepsCalc: new Array(1, 1000, 1000, 10, 100, 1000)
}
var volume = 
{
    steps: new Array("millilitres", "centilitres", "litres", "cubic metre"), 
    stepsCalc: new Array(1, 100, 1000, 1000)
}
var count = 
{
    steps: new Array("units", "millions", "billions"), 
    stepsCalc: new Array(1, 1000000, 1000)
}
var units = new Array(time, length, volume, count);