﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Infrastructure;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Metadata;
using MyNetSensors.Gateways;
using MyNetSensors.Nodes;

namespace MyNetSensors.Repositories.EF.SQLite
{
    public class UITimerNodesDbContext : DbContext
    {
        public DbSet<UITimerTask> UITimerNodes { get; set; }
    }
}
