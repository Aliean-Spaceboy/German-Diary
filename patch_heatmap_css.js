const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const missingCss = `
    .heatmap {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 10px;
    }
    .heat-cell {
      width: 14px;
      height: 14px;
      border-radius: 3px;
      background: var(--surface2);
      transition: transform 0.2s;
    }
    .heat-cell:hover {
      transform: scale(1.2);
    }
    .heat-1 { background: #10b981; opacity: 0.5; }
    .heat-2 { background: #10b981; opacity: 0.8; }
    .heat-3 { background: #10b981; opacity: 1.0; }
`;

if (!html.includes('.heat-cell {')) {
  html = html.replace('</style>', missingCss + '\n  </style>');
  fs.writeFileSync('index.html', html, 'utf8');
  console.log("Heatmap CSS injected!");
} else {
  console.log("Heatmap CSS already present.");
}
