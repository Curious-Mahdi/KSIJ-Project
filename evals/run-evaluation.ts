import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { ChatResponse } from "../src/lib/rag/types";

dotenv.config();

// Since we can't easily call our own Next.js API in a script without starting the server,
// we will just make a fetch call to the local server. The server must be running!
const API_URL = "http://localhost:3000/api/chat";

async function runEvaluation() {
  const datasetPath = path.join(__dirname, "golden-dataset.json");
  const dataset = JSON.parse(fs.readFileSync(datasetPath, "utf-8"));
  
  console.log("============================================");
  console.log(" COMMUNITY RAG EVALUATION");
  console.log("============================================");
  
  let totalScore = 0;
  const maxScore = dataset.length * 5;
  const failedQuestions: string[] = [];

  for (const q of dataset) {
    console.log(`\nEvaluating [${q.id}]: ${q.question}`);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q.question })
      });
      
      if (!res.ok) {
        console.error(`API Error: ${res.status} ${res.statusText}`);
        failedQuestions.push(q.id);
        continue;
      }
      
      const data: ChatResponse = await res.json();
      
      let qScore = 0;
      
      // Basic checks for MVP
      // 1. Answer correctness (manual/LLM grading in prod, here we just check if we got an answer)
      if (data.answer && data.answer.length > 10) qScore += 1;
      
      // 2. Source correctness
      let sourceCorrect = true;
      if (q.expected_sources.length > 0) {
         sourceCorrect = q.expected_sources.some((src: string) => 
           data.citations.some(c => c.filename.includes(src.replace('.md', '')))
         );
      }
      if (sourceCorrect) qScore += 1;
      
      // 3. Grounding
      if (data.grounded !== q.should_abstain) qScore += 1;
      
      // 4. Abstention behavior
      const isAbstention = data.answer.includes("I couldn't find sufficient information") || 
                           data.answer.includes("does not have sufficient information") ||
                           data.answer.includes("outside the knowledge base");
      if (isAbstention === q.should_abstain) qScore += 1;
      
      // 5. Citation presence
      if (q.should_abstain || data.citations.length > 0) qScore += 1;
      
      console.log(`Score: ${qScore}/5 | Abstention: ${isAbstention} | Grounded: ${data.grounded}`);
      
      totalScore += qScore;
      if (qScore < 4) failedQuestions.push(q.id);
      
    } catch (err) {
      console.error("Failed to evaluate:", err);
      failedQuestions.push(q.id);
    }
  }

  const percentage = (totalScore / maxScore) * 100;
  
  console.log("\n============================================");
  console.log(`Questions evaluated: ${dataset.length}`);
  console.log(`Overall score:       ${totalScore}/${maxScore} (${percentage.toFixed(1)}%)`);
  
  if (failedQuestions.length > 0) {
    console.log("\nQuestions requiring review:");
    failedQuestions.forEach(id => console.log(`- ${id}`));
  }
  console.log("============================================");
}

runEvaluation();
