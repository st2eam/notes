import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './style.css'
import './embed.css'
import './components/design/demo.css'
import MotionLab from './components/design/MotionLab.vue'
import DohertyLab from './components/design/DohertyLab.vue'
import TypeLab from './components/design/TypeLab.vue'
import ColorLab from './components/design/ColorLab.vue'
import PrincipleLab from './components/design/PrincipleLab.vue'
import GestaltLab from './components/design/GestaltLab.vue'
import GestaltExample from './components/design/GestaltExample.vue'
import LawExample from './components/design/LawExample.vue'
import ExposureLab from './components/photography/ExposureLab.vue'
import MeteringLab from './components/photography/MeteringLab.vue'
import CompositionLab from './components/photography/CompositionLab.vue'
import WhiteBalanceLab from './components/photography/WhiteBalanceLab.vue'
import RawJpegLab from './components/photography/RawJpegLab.vue'
import './components/photography/photo.css'
import SqlJoinLab from './components/ai/SqlJoinLab.vue'
import EvalMatrixLab from './components/ai/EvalMatrixLab.vue'
import AttentionLab from './components/ai/AttentionLab.vue'
import RetrievalLab from './components/ai/RetrievalLab.vue'
import ToolSafetyLab from './components/ai/ToolSafetyLab.vue'
import './components/ai/ai-lab.css'

import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('MotionLab', MotionLab)
    app.component('DohertyLab', DohertyLab)
    app.component('TypeLab', TypeLab)
    app.component('ColorLab', ColorLab)
    app.component('PrincipleLab', PrincipleLab)
    app.component('GestaltLab', GestaltLab)
    app.component('GestaltExample', GestaltExample)
    app.component('LawExample', LawExample)
    app.component('ExposureLab', ExposureLab)
    app.component('MeteringLab', MeteringLab)
    app.component('CompositionLab', CompositionLab)
    app.component('WhiteBalanceLab', WhiteBalanceLab)
    app.component('RawJpegLab', RawJpegLab)
    app.component('SqlJoinLab', SqlJoinLab)
    app.component('EvalMatrixLab', EvalMatrixLab)
    app.component('AttentionLab', AttentionLab)
    app.component('RetrievalLab', RetrievalLab)
    app.component('ToolSafetyLab', ToolSafetyLab)
  },
} satisfies Theme
