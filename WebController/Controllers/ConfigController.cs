﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using MyNetSensors.WebController.Code;
using MyNetSensors.WebController.ViewModels.Config;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace MyNetSensors.WebController.Controllers
{
    public class ConfigController : Controller
    {

        private const string SETTINGS_FILE_NAME = "appsettings.json";
        private IConfigurationRoot сonfiguration;

        public ConfigController(IConfigurationRoot сonfiguration)
        {
            this.сonfiguration = сonfiguration;
        }

        private dynamic ReadConfig()
        {
            return JObject.Parse(System.IO.File.ReadAllText(SETTINGS_FILE_NAME));
        }

        private void WriteConfig(dynamic config)
        {
            System.IO.File.WriteAllText(SETTINGS_FILE_NAME, config.ToString());
        }

        public IActionResult Index()
        {
            bool firstRun = Boolean.Parse(сonfiguration["FirstRun"]);

            if (firstRun)
                return RedirectToAction("FirstRun");

            return View();
        }





        [HttpGet]
        public IActionResult FirstRun()
        {
            List<string> ports = NodesController.comPort.GetPortsList();
            string currentPort = NodesController.serialPortName;

            ViewBag.ports = ports;

            if (ports.Contains(currentPort))
                ViewBag.currentPort = currentPort;

            return View(new SerialPortViewModel());
        }


        [HttpPost]
        public IActionResult FirstRun(SerialPortViewModel port)
        {
            if (String.IsNullOrEmpty(port.PortName))
                return RedirectToAction("FirstRun");

            dynamic json = ReadConfig();
            json.SerialGateway.SerialPort = port.PortName;
            json.FirstRun = false;
            WriteConfig(json);
            сonfiguration.Reload();

            NodesControllerConfigurator.Start(сonfiguration);

            return RedirectToAction("Index", "Dashboard");
        }



        [HttpGet]
        public IActionResult SerialPort()
        {
            List<string> ports = NodesController.comPort.GetPortsList();
            string currentPort = NodesController.serialPortName;

            ViewBag.ports = ports;

            if (ports.Contains(currentPort))
                ViewBag.currentPort = currentPort;

            return View(new SerialPortViewModel());
        }


        [HttpPost]
        public IActionResult SerialPort(SerialPortViewModel port)
        {
            if (String.IsNullOrEmpty(port.PortName))
                return RedirectToAction("SerialPort");

            dynamic json = ReadConfig();
            json.SerialGateway.SerialPort = port.PortName;
            WriteConfig(json);
            сonfiguration.Reload();

            NodesController.gateway.Disconnect();
            NodesController.serialPortName = port.PortName;

            return RedirectToAction("Index");
        }




        [HttpPost]
        public async Task<bool> ConnectSerialController()
        {
            dynamic json = ReadConfig();
            json.SerialGateway.Enable = true;
            WriteConfig(json);
            сonfiguration.Reload();

            string portname = NodesController.serialPortName;
            await NodesController.gateway.Connect(portname);

            return true;
        }

        [HttpPost]
        public bool DisconnectSerialController()
        {
            dynamic json = ReadConfig();
            json.SerialGateway.Enable = false;
            WriteConfig(json);
            сonfiguration.Reload();

            NodesController.gateway.Disconnect();

            return true;
        }
    }

}
