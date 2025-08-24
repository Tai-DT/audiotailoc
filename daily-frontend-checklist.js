#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DailyFrontendChecklist {
  constructor() {
    this.projectRoot = process.cwd();
    this.frontendDir = path.join(this.projectRoot, 'frontend');
    this.checklistFile = path.join(this.projectRoot, 'daily-checklist.json');
    this.today = new Date().toISOString().split('T')[0];
  }

  // Initialize daily checklist
  initialize() {
    console.log('📋 Initializing Daily Frontend Checklist...\n');
    
    const checklist = {
      date: this.today,
      phase: 1,
      tasks: {
        morning: [
          { task: 'Check backend status', completed: false, notes: '' },
          { task: 'Review yesterday\'s progress', completed: false, notes: '' },
          { task: 'Plan today\'s tasks', completed: false, notes: '' },
          { task: 'Setup development environment', completed: false, notes: '' }
        ],
        development: [
          { task: 'API integration work', completed: false, notes: '' },
          { task: 'Component development', completed: false, notes: '' },
          { task: 'State management setup', completed: false, notes: '' },
          { task: 'UI/UX improvements', completed: false, notes: '' }
        ],
        testing: [
          { task: 'Run unit tests', completed: false, notes: '' },
          { task: 'Run integration tests', completed: false, notes: '' },
          { task: 'Manual testing', completed: false, notes: '' },
          { task: 'Performance testing', completed: false, notes: '' }
        ],
        endOfDay: [
          { task: 'Commit all changes', completed: false, notes: '' },
          { task: 'Update progress', completed: false, notes: '' },
          { task: 'Document issues', completed: false, notes: '' },
          { task: 'Plan tomorrow', completed: false, notes: '' }
        ]
      },
      metrics: {
        linesOfCode: 0,
        componentsCreated: 0,
        testsWritten: 0,
        bugsFixed: 0,
        performanceScore: 0
      },
      notes: ''
    };

    this.saveChecklist(checklist);
    console.log('✅ Daily checklist initialized');
    this.showChecklist();
  }

  // Load checklist
  loadChecklist() {
    if (fs.existsSync(this.checklistFile)) {
      const data = fs.readFileSync(this.checklistFile, 'utf8');
      return JSON.parse(data);
    }
    return null;
  }

  // Save checklist
  saveChecklist(checklist) {
    fs.writeFileSync(this.checklistFile, JSON.stringify(checklist, null, 2));
  }

  // Show checklist
  showChecklist() {
    const checklist = this.loadChecklist();
    if (!checklist) {
      console.log('❌ No checklist found. Run "init" to create one.');
      return;
    }

    console.log(`📋 Daily Checklist - ${checklist.date}\n`);
    console.log(`🎯 Phase: ${checklist.phase}\n`);

    Object.entries(checklist.tasks).forEach(([section, tasks]) => {
      console.log(`📌 ${section.toUpperCase()}:`);
      tasks.forEach((task, index) => {
        const status = task.completed ? '✅' : '⭕';
        console.log(`  ${index + 1}. ${status} ${task.task}`);
        if (task.notes) {
          console.log(`     📝 ${task.notes}`);
        }
      });
      console.log('');
    });

    if (checklist.metrics) {
      console.log('📊 Metrics:');
      console.log(`  📝 Lines of Code: ${checklist.metrics.linesOfCode}`);
      console.log(`  🎨 Components Created: ${checklist.metrics.componentsCreated}`);
      console.log(`  🧪 Tests Written: ${checklist.metrics.testsWritten}`);
      console.log(`  🐛 Bugs Fixed: ${checklist.metrics.bugsFixed}`);
      console.log(`  ⚡ Performance Score: ${checklist.metrics.performanceScore}/100`);
      console.log('');
    }

    if (checklist.notes) {
      console.log('📝 Notes:');
      console.log(`  ${checklist.notes}\n`);
    }
  }

  // Mark task as completed
  completeTask(section, taskIndex) {
    const checklist = this.loadChecklist();
    if (!checklist) {
      console.log('❌ No checklist found. Run "init" to create one.');
      return;
    }

    if (checklist.tasks[section] && checklist.tasks[section][taskIndex]) {
      checklist.tasks[section][taskIndex].completed = true;
      this.saveChecklist(checklist);
      console.log(`✅ Marked task as completed: ${checklist.tasks[section][taskIndex].task}`);
    } else {
      console.log('❌ Invalid section or task index');
    }
  }

  // Add note to task
  addNote(section, taskIndex, note) {
    const checklist = this.loadChecklist();
    if (!checklist) {
      console.log('❌ No checklist found. Run "init" to create one.');
      return;
    }

    if (checklist.tasks[section] && checklist.tasks[section][taskIndex]) {
      checklist.tasks[section][taskIndex].notes = note;
      this.saveChecklist(checklist);
      console.log(`📝 Added note to task: ${checklist.tasks[section][taskIndex].task}`);
    } else {
      console.log('❌ Invalid section or task index');
    }
  }

  // Update metrics
  updateMetrics(metric, value) {
    const checklist = this.loadChecklist();
    if (!checklist) {
      console.log('❌ No checklist found. Run "init" to create one.');
      return;
    }

    if (checklist.metrics[metric] !== undefined) {
      checklist.metrics[metric] = value;
      this.saveChecklist(checklist);
      console.log(`📊 Updated ${metric}: ${value}`);
    } else {
      console.log('❌ Invalid metric');
    }
  }

  // Morning routine
  async morningRoutine() {
    console.log('🌅 Starting Morning Routine...\n');
    
    const checklist = this.loadChecklist();
    if (!checklist) {
      console.log('❌ No checklist found. Run "init" to create one.');
      return;
    }

    // Check backend status
    console.log('🔍 Checking backend status...');
    try {
      const response = await fetch('http://localhost:3010/api/v1/health');
      if (response.ok) {
        console.log('✅ Backend is running');
        this.completeTask('morning', 0);
      } else {
        console.log('❌ Backend is not responding');
      }
    } catch (error) {
      console.log('❌ Backend is not running');
    }

    // Setup development environment
    console.log('⚙️ Setting up development environment...');
    try {
      process.chdir(this.frontendDir);
      execSync('npm install', { stdio: 'pipe' });
      console.log('✅ Dependencies installed');
      this.completeTask('morning', 3);
    } catch (error) {
      console.log('❌ Failed to setup environment');
    }

    console.log('✅ Morning routine completed');
  }

  // Development session
  async developmentSession() {
    console.log('💻 Starting Development Session...\n');
    
    const checklist = this.loadChecklist();
    if (!checklist) {
      console.log('❌ No checklist found. Run "init" to create one.');
      return;
    }

    console.log('🎯 Development tasks for today:');
    checklist.tasks.development.forEach((task, index) => {
      console.log(`  ${index + 1}. ${task.task}`);
    });

    console.log('\n💡 Tips:');
    console.log('  - Commit frequently');
    console.log('  - Test as you go');
    console.log('  - Document your work');
    console.log('  - Take breaks every hour');
  }

  // Testing session
  async testingSession() {
    console.log('🧪 Starting Testing Session...\n');
    
    const checklist = this.loadChecklist();
    if (!checklist) {
      console.log('❌ No checklist found. Run "init" to create one.');
      return;
    }

    // Run unit tests
    console.log('📋 Running unit tests...');
    try {
      process.chdir(this.frontendDir);
      execSync('npm test -- --watchAll=false', { stdio: 'pipe' });
      console.log('✅ Unit tests passed');
      this.completeTask('testing', 0);
    } catch (error) {
      console.log('❌ Unit tests failed');
    }

    // Run performance tests
    console.log('⚡ Running performance tests...');
    try {
      execSync('npm run lighthouse', { stdio: 'pipe' });
      console.log('✅ Performance tests completed');
      this.completeTask('testing', 3);
    } catch (error) {
      console.log('❌ Performance tests failed');
    }

    console.log('✅ Testing session completed');
  }

  // End of day routine
  async endOfDayRoutine() {
    console.log('🌙 Starting End of Day Routine...\n');
    
    const checklist = this.loadChecklist();
    if (!checklist) {
      console.log('❌ No checklist found. Run "init" to create one.');
      return;
    }

    // Commit changes
    console.log('💾 Committing changes...');
    try {
      execSync('git add .', { stdio: 'pipe' });
      execSync('git commit -m "Daily development progress"', { stdio: 'pipe' });
      console.log('✅ Changes committed');
      this.completeTask('endOfDay', 0);
    } catch (error) {
      console.log('❌ Failed to commit changes');
    }

    // Generate daily report
    this.generateDailyReport();
    
    console.log('✅ End of day routine completed');
  }

  // Generate daily report
  generateDailyReport() {
    const checklist = this.loadChecklist();
    if (!checklist) return;

    const completedTasks = Object.values(checklist.tasks)
      .flat()
      .filter(task => task.completed).length;
    
    const totalTasks = Object.values(checklist.tasks)
      .flat().length;

    const completionRate = Math.round((completedTasks / totalTasks) * 100);

    console.log('\n📊 Daily Report Summary:');
    console.log(`  ✅ Tasks Completed: ${completedTasks}/${totalTasks}`);
    console.log(`  📈 Completion Rate: ${completionRate}%`);
    console.log(`  🎨 Components Created: ${checklist.metrics.componentsCreated}`);
    console.log(`  🧪 Tests Written: ${checklist.metrics.testsWritten}`);
    console.log(`  🐛 Bugs Fixed: ${checklist.metrics.bugsFixed}`);
    console.log(`  ⚡ Performance Score: ${checklist.metrics.performanceScore}/100`);

    if (completionRate >= 80) {
      console.log('🎉 Excellent progress today!');
    } else if (completionRate >= 60) {
      console.log('✅ Good progress today!');
    } else {
      console.log('⚠️ Need to improve productivity tomorrow');
    }
  }

  // Show help
  showHelp() {
    console.log('📋 Daily Frontend Checklist Commands\n');
    console.log('Available commands:');
    console.log('  init          - Initialize daily checklist');
    console.log('  show          - Show current checklist');
    console.log('  complete      - Mark task as completed');
    console.log('  note          - Add note to task');
    console.log('  metrics       - Update metrics');
    console.log('  morning       - Run morning routine');
    console.log('  dev           - Start development session');
    console.log('  test          - Run testing session');
    console.log('  end           - Run end of day routine');
    console.log('  help          - Show this help message');
    
    console.log('\nExamples:');
    console.log('  node daily-frontend-checklist.js init');
    console.log('  node daily-frontend-checklist.js complete morning 0');
    console.log('  node daily-frontend-checklist.js note development 0 "API integration started"');
    console.log('  node daily-frontend-checklist.js metrics componentsCreated 5');
  }
}

// Main execution
async function main() {
  const checklist = new DailyFrontendChecklist();
  const command = process.argv[2];
  const arg1 = process.argv[3];
  const arg2 = process.argv[4];
  const arg3 = process.argv[5];
  
  switch (command) {
    case 'init':
      checklist.initialize();
      break;
    case 'show':
      checklist.showChecklist();
      break;
    case 'complete':
      if (arg1 && arg2) {
        checklist.completeTask(arg1, parseInt(arg2));
      } else {
        console.log('❌ Usage: complete <section> <taskIndex>');
      }
      break;
    case 'note':
      if (arg1 && arg2 && arg3) {
        checklist.addNote(arg1, parseInt(arg2), arg3);
      } else {
        console.log('❌ Usage: note <section> <taskIndex> <note>');
      }
      break;
    case 'metrics':
      if (arg1 && arg2) {
        checklist.updateMetrics(arg1, parseInt(arg2));
      } else {
        console.log('❌ Usage: metrics <metric> <value>');
      }
      break;
    case 'morning':
      await checklist.morningRoutine();
      break;
    case 'dev':
      await checklist.developmentSession();
      break;
    case 'test':
      await checklist.testingSession();
      break;
    case 'end':
      await checklist.endOfDayRoutine();
      break;
    case 'help':
    default:
      checklist.showHelp();
      break;
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = DailyFrontendChecklist;
