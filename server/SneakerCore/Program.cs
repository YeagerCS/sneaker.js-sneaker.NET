using Sneaker.Builders.Services;
using Sneaker.Static;

// Configure Options
Options.Debug = false;
Options.Host = "localhost";
Options.Port = 9876;

var builder = ServiceBuilder.CreateBuilder();
// Add Services

var app = builder.Build();

app.Run();