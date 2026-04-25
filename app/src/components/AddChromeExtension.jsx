"use client"
import React from 'react'

import { useState, useEffect } from 'react'

export default function AddChromeExtension() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const EXTENSION_ID = 'agkigmoblgmnknebhjihfkonjgghjdbm'

  useEffect(() => {
    checkExtensionInstalled()
  }, [])

  const checkExtensionInstalled = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      try {
        chrome.runtime.sendMessage(
          EXTENSION_ID,
          { action: 'ping' },
          (response) => {
            setIsInstalled(!!response)
          }
        )
      } catch (error) {
        setIsInstalled(false)
      }
    }
  }

  const handleAddToChrome = () => {
    
    const link = document.createElement('a')
    link.href = '/accessibility-analyzer.zip' 
    link.download = 'accessibility-analyzer.zip'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setShowInstructions(true)
    setCurrentStep(1)
  }

  const handleOpenExtensions = () => {
    window.open('chrome://extensions/', '_blank')
  }

  const steps = [
    {
      number: 1,
      title: 'Extension Downloaded',
      description: 'The extension ZIP file has been downloaded to your computer.',
      action: 'Next',
      icon: '⬇️'
    },
    {
      number: 2,
      title: 'Extract the ZIP File',
      description: 'Right-click the downloaded file and select "Extract All" (Windows) or double-click it (Mac).',
      action: 'Next',
      icon: '📁'
    },
    {
      number: 3,
      title: 'Open Chrome Extensions',
      description: 'Click the button below or type chrome://extensions/ in your address bar.',
      action: 'Open Extensions Page',
      actionHandler: handleOpenExtensions,
      icon: '🔧'
    },
    {
      number: 4,
      title: 'Enable Developer Mode',
      description: 'Toggle the "Developer mode" switch in the top-right corner of the extensions page.',
      action: 'Next',
      icon: '⚙️'
    },
    {
      number: 5,
      title: 'Load the Extension',
      description: 'Click "Load unpacked" and select the extracted folder (containing manifest.json).',
      action: 'Done',
      icon: '✅'
    }
  ]

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
     
      {!isInstalled && !showInstructions && (
        <div className="text-center">
          <button
            onClick={handleAddToChrome}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-full hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Add to Chrome - Free
          </button>
          <p className="mt-4 text-sm text-gray-600">
            No sign-up required • Works offline • Privacy-first
          </p>
        </div>
      )}

      {isInstalled && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-green-800 mb-2">
            Extension Already Installed!
          </h3>
          <p className="text-green-700 mb-4">
            You're all set. Click the extension icon in your toolbar to start analyzing.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Refresh Page
          </button>
        </div>
      )}

      {showInstructions && !isInstalled && (
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        
          <div className="bg-gray-100 p-4">
            <div className="flex justify-between items-center mb-2">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`flex items-center ${
                    index < steps.length - 1 ? 'flex-1' : ''
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      index < currentStep
                        ? 'bg-green-500 text-white'
                        : index === currentStep
                        ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {index < currentStep ? '✓' : step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">
                {steps[currentStep]?.icon}
              </div>
              <h2 className="text-3xl font-bold mb-3">
                {steps[currentStep]?.title}
              </h2>
              <p className="text-lg text-gray-600">
                {steps[currentStep]?.description}
              </p>
            </div>

            {currentStep === 2 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-mono text-blue-900">
                  chrome://extensions/
                </p>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="font-semibold text-yellow-900 mb-1">Tip:</p>
                  <p className="text-sm text-yellow-800">
                    Look for the toggle switch labeled "Developer mode" in the top-right corner.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center mt-8">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                >
                  ← Back
                </button>
              )}
              
              <button
                onClick={() => {
                  if (steps[currentStep]?.actionHandler) {
                    steps[currentStep].actionHandler()
                  }
                  
                  if (currentStep < steps.length - 1) {
                    setCurrentStep(currentStep + 1)
                  } else {
                   
                    setTimeout(() => {
                      checkExtensionInstalled()
                      if (!isInstalled) {
                        setShowInstructions(false)
                      }
                    }, 1000)
                  }
                }}
                className={`px-8 py-3 rounded-lg font-medium ${
                  currentStep === steps.length - 1
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {steps[currentStep]?.action}
              </button>
            </div>

           
            {currentStep === 0 && (
              <div className="text-center mt-6">
                <button className="text-blue-600 hover:underline text-sm">
                  📺 Watch Video Tutorial
                </button>
              </div>
            )}
          </div>

          
          <div className="bg-gray-50 p-4 text-center border-t">
            <button
              onClick={() => setShowInstructions(false)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Close Instructions
            </button>
          </div>
        </div>
      )}

     
    </div>
  )
}
