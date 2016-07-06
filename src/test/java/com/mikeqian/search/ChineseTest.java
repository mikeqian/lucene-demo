package com.mikeqian.search;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.TokenStream;
import org.apache.lucene.analysis.cjk.CJKAnalyzer;
import org.apache.lucene.analysis.core.SimpleAnalyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.analysis.tokenattributes.CharTermAttribute;
import org.apdplat.word.dictionary.DictionaryFactory;
import org.apdplat.word.lucene.ChineseWordAnalyzer;
import org.apdplat.word.segmentation.SegmentationAlgorithm;
import org.apdplat.word.segmentation.SegmentationFactory;
import org.apdplat.word.util.WordConfTools;
import org.junit.Test;

import java.io.IOException;

/**
 * Created by luhan.qian on 2016/7/5.
 */
public class ChineseTest {


    @Test
    public void analyzerTest() throws IOException {
        WordConfTools.set("dic.path", "classpath:dic.txt,classpath:dic_CN.txt");
        //DictionaryFactory.reload();//更改词典路径之后，重新加载词典

        String text = "钱露晗是河伯！";
        Analyzer analyzer = new ChineseWordAnalyzer();
        analysis(text, analyzer);
    }

    public static void analysis(String text, Analyzer analyzer) throws IOException {
        System.out.println(analyzer.getClass().getName());
        TokenStream tokenStream = analyzer.tokenStream("text", text);
//准备消费
        tokenStream.reset();
//开始消费
        while (tokenStream.incrementToken()) {
            //词
            CharTermAttribute charTermAttribute = tokenStream.getAttribute(CharTermAttribute.class);
            System.out.println(charTermAttribute.toString());
        }
//消费完毕
        tokenStream.close();
    }
}
