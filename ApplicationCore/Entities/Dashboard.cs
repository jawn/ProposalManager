﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ApplicationCore.Entities
{
    public class Dashboard : BaseEntity<Dashboard>
    {
        [JsonProperty("customername", Order = 2)]
        public string CustomerName { get; set; }
        [JsonProperty("opportunityid", Order = 3)]
        public string OpportunityId { get; set; }
        [JsonProperty("status", Order = 4)]
        public string Status { get; set; }
        [JsonProperty("startdate", Order = 5)]
        public DateTimeOffset StartDate { get; set; }
        [JsonProperty("targetcompletiondate", Order = 6)]
        public DateTimeOffset TargetCompletionDate { get; set; }
        [JsonProperty("compliancereviewstartdate", Order = 7)]
        public DateTimeOffset ComplianceReviewStartDate { get; set; }
        [JsonProperty("compliancereviewcomplteiondate", Order = 8)]
        public DateTimeOffset ComplianceReviewComplteionDate { get; set; }
        [JsonProperty("creditcheckstartdate", Order = 9)]
        public DateTimeOffset CreditCheckStartDate { get; set; }
        [JsonProperty("creditcheckcompletiondate", Order =10)]
        public DateTimeOffset CreditCheckCompletionDate { get; set; }
        [JsonProperty("riskassesmentstartdate", Order = 11)]
        public DateTimeOffset RiskAssesmentStartDate { get; set; }
        [JsonProperty("riskassesmentcompletiondate", Order = 12)]
        public DateTimeOffset RiskAssesmentCompletionDate { get; set; }
        [JsonProperty("formalproposalstartdate", Order = 13)]
        public DateTimeOffset FormalProposalStartDate { get; set; }
        [JsonProperty("formalproposalcompletiondate", Order = 14)]
        public DateTimeOffset FormalProposalCompletionDate { get; set; }
        [JsonProperty("statuschangeddate", Order = 15)]
        public DateTimeOffset StatusChangedDate { get; set; }
        [JsonProperty("opportunityenddate", Order = 16)]
        public DateTimeOffset OpportunityEndDate { get; set; }
        [JsonProperty("opportunityname", Order = 17)]
        public string OpportunityName { get; set; }
        [JsonProperty("loanofficer", Order = 18)]
        public string LoanOfficer { get; set; }
        [JsonProperty("relationshipmanager", Order = 19)]
        public string RelationshipManager { get; set; }
        //Calculated Columns

        [JsonProperty("TotalNoOfDays", Order = 20)]
        public int TotalNoOfDays { get; set; }
        [JsonProperty("CreditCheckNoOfDays", Order = 21)]
        public int CreditCheckNoOfDays { get; set; }
        [JsonProperty("ComplianceReviewNoOfDays", Order = 22)]
        public int ComplianceReviewNoOfDays { get; set; }
        [JsonProperty("FormalProposalNoOfDays", Order = 23)]
        public int FormalProposalNoOfDays { get; set; }
        [JsonProperty("RiskAssessmentNoOfDays", Order = 24)]
        public int RiskAssessmentNoOfDays { get; set; }
        public static Dashboard Empty
        {
            get => new Dashboard
            {
                Id = String.Empty,
                CustomerName = string.Empty,
                OpportunityId = string.Empty,
                Status = string.Empty,
                StartDate = new DateTimeOffset(),
                TargetCompletionDate = new DateTimeOffset(),
                ComplianceReviewStartDate = new DateTimeOffset(),
                ComplianceReviewComplteionDate = new DateTimeOffset(),
                CreditCheckStartDate = new DateTimeOffset(),
                CreditCheckCompletionDate = new DateTimeOffset(),
                RiskAssesmentStartDate = new DateTimeOffset(),
                RiskAssesmentCompletionDate = new DateTimeOffset(),
                FormalProposalStartDate = new DateTimeOffset(),
                FormalProposalCompletionDate = new DateTimeOffset(),
                StatusChangedDate = new DateTimeOffset(),
                OpportunityEndDate = new DateTimeOffset(),
                OpportunityName = string.Empty,
                LoanOfficer =string.Empty,
                RelationshipManager =string.Empty,
                TotalNoOfDays=0,
                CreditCheckNoOfDays =0,
                ComplianceReviewNoOfDays =0,
                FormalProposalNoOfDays=0,
                RiskAssessmentNoOfDays=0
            };
        }
    }
}
