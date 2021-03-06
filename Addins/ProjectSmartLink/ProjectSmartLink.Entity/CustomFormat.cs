﻿// Copyright(c) Microsoft Corporation. 
// All rights reserved.
//
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information.

using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectSmartLink.Entity
{
    public class CustomFormat : BaseEntity
    {
        public string Name { get; set; }

        public string DisplayName { get; set; }

        public string Description { get; set; }

        public int OrderBy { get; set; }

        public bool IsDeleted { get; set; }

        public string GroupName { get; set; }

        public int GroupOrderBy { get; set; }

        [JsonIgnore]
        public virtual ICollection<DestinationPointCustomFormats> DestinationPointCustomFormats { get; set; }
    }
}
